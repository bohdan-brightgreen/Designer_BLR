<?php
namespace App\Repositories;

use App\Contracts\DesignInterface;
use App\Models\Design;

class DesignRepository extends BaseRepository implements DesignInterface
{
    private $Model;

    public function __construct(Design $model)
    {
        $this->Model = $model;
    }

    public function get($id, $deep = false)
    {
        if ($deep) {
            return $this->getByField('id', $id);
        }

        return $this->Model->find($id);
    }

    public function getByProjectId($projectId)
    {
        return $this->getByField('project_id', $projectId);
    }

    public function getByField($field, $id)
    {
        return $this->Model
            ->with([
                'designArea' => function($query) {
                    $query->get(['id', 'design_id', 'title', 'description', 'version', 'created', 'modified', 'last_modified_by_id']);
                }
            ])
            ->where($field, $id)
            ->get();
    }

    public function getProjectIds(array $id = [])
    {
        $result = [];
        $model = $this->Model->whereIn('id', $id)->pluck('project_id', 'id')->all();
        if ($model === null) {
            return $result;
        }

        foreach ($model as $designId => $projectId) {
            $result[$projectId][] = $designId;
        }

        return $result;
    }

    public function create(array $data = [])
    {
        $data = $this->cleanFields($data, ['project_id', 'title', 'description']);
        if (empty($data)) {
            return null;
        }

        $model = $this->Model->create($data);

        return ($model === null) ? null : $model->id;
    }

    public function update($id, array $data = [])
    {
        $model = $this->get($id);
        if ($model === null) {
            return false;
        }

        $model = $this->assignFields($model, $data, ['title', 'description']);
        $model->save();

        return true;
    }

    public function delete($id)
    {
        $model = $this->Model->find($id);
        if ($model === null) {
            return false;
        }

        return $model->delete();
    }
}