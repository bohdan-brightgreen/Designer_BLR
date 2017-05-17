<?php
namespace App\Repositories;

use App\Contracts\ProjectAccessInterface;
use App\Models\ProjectAccess;

class ProjectAccessRepository extends BaseRepository implements ProjectAccessInterface
{
    private $Model;

    public function __construct(ProjectAccess $model)
    {
        $this->Model = $model;
    }

    public function userProjects($userId)
	{
        return $this->Model->where('user_id', (int) $userId)->pluck('is_editable', 'project_id')->all();
	}

    public function add($projectId, $userId, $isEditable = false)
    {
        $model = $this->Model->firstOrCreate(['project_id' => (int) $projectId, 'user_id' => (int) $userId]);
        if ($model === null) {
            return null;
        }

        $model->is_editable = $this->toBool($isEditable);
        $model->save();

        return $model->id;
    }

    public function update(array $data)
    {
        if (!$this->isFieldsExists($data, ['user_id', 'project_id', 'is_editable'])) {
            return false;
        }

        $model = $this->Model->conditions([
            'user_id' => (int) $data['user_id'],
            'project_id' => (int) $data['project_id']
        ])->first();

        if ($model === null) {
            return false;
        }

        $isEditable = $this->toBool($data['is_editable']);

        $model->is_editable = $isEditable;
        $model->save();

        return $isEditable;
    }

    public function delete($projectId, $userId)
    {
        $rows = $this->Model->conditions([
            'project_id' => (int) $projectId,
            'user_id' => (int) $userId
        ])->delete();

        return ($rows >= 1);
    }
}