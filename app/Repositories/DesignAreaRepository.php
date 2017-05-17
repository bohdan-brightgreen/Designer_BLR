<?php
namespace App\Repositories;

use App\Contracts\DesignAreaInterface;
use App\Models\DesignArea;

class DesignAreaRepository extends BaseRepository implements DesignAreaInterface
{
    private $Model;

    public function __construct(DesignArea $model)
    {
        $this->Model = $model;
    }

	public function get($id)
	{
        return $this->Model->where('id', $id)->get();
	}

    public function getByDesignId($designId)
    {
        return $this->Model->where('design_id', $designId)->get();
    }

    public function projectId($id)
    {
        $model = $this->Model->with('design')->find($id, ['id', 'design_id']);

        return ($model === null) ? null : $model->design->project_id;
    }

    public function create($userId, array $data = [])
    {
        if ($this->isEmptyFields($data, ['design_id', 'title'])) {
            return null;
        }

        $model = $this->Model->create(['design_id' => $data['design_id'], 'title' => $data['title']]);
        if ($model === null) {
            return null;
        }

        $model = $this->assignFields($model, $data, ['description', 'value']);
        $model->last_modified_by_id = $userId;

        $model->save();

        $this->lock($model->id, $userId);

        return $model->id;
    }

    public function update($id, $userId, array $data = [])
    {
        $model = $this->Model->find($id);
        if ($model === null) {
            return false;
        }

        $model = $this->assignFields($model, $data, ['title', 'description']);

        $isContinue = isset($data['continue']) ? (bool) $data['continue'] : false;
        $currentValue = ($isContinue && !empty($data['value'])) ? $model->value : '';

        $model->value = $currentValue . $data['value'];
        $model->last_modified_by_id = $userId;

        $model->save();

        $this->lock($model->id, $userId);

        return true;
    }

    public function delete($id)
    {
        $model = $this->Model->find($id, ['id']);
        if ($model === null) {
            return false;
        }

        return $model->delete();
    }

    public function lock($id, $userId)
    {
        $this->Model->where('id', $id)->update([
            'lock_expire' => date('Y-m-d H:i:s', time() + 60*10),
            'locked_by' => $userId
        ]);
    }

    public function unlock($id)
    {
        $this->Model->where('id', $id)->update([
            'lock_expire' => null,
            'locked_by' => null
        ]);
    }

    public function isLocked($id, $currentUserId)
    {
        $model = $this->Model->find($id, ['id', 'locked_by', 'lock_expire']);
        if ($model === null) {
            return true;
        }

        // Expired lock
        if (strtotime($model->lock_expire) < time()) {
            if (!empty($model->lock_expire) || !empty($model->locked_by)) {
                $this->unlock($id);
            }
            return false;
        }

        if ($model->locked_by == $currentUserId) {
            return false;
        }

        return true;
    }
}