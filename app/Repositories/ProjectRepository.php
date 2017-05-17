<?php
namespace App\Repositories;

use App\Contracts\ProjectInterface;
use App\Models\Project;

class ProjectRepository extends BaseRepository implements ProjectInterface
{
    private $Model;

    public function __construct(Project $model)
    {
        $this->Model = $model;
    }

	public function get($id)
	{
        if (empty($id)) {
            return null;
        }

        $id = is_array($id) ? $id : [$id];

        return $this->Model
            ->whereIn('id', $id)
            ->orderBy('created', 'desc')
            ->get();
	}

    public function create($ownerId, array $data)
    {
        if ($this->isEmptyFields($data, ['title'])) {
            return null;
        }

        $model = $this->Model->create([
            'uid' => str_random(60),
            'title' => $data['title'],
            'owner_id' => (int) $ownerId
        ]);

        if ($model === null) {
            return null;
        }

        $model = $this->assignFields($model, $data, ['description', 'property_type', 'original_owner_id']);
        $model->save();

        return $model->id;
    }

    public function update($id, array $data = [])
    {
        $model = $this->Model->find($id);
        if ($model === null) {
            return false;
        }

        $model = $this->assignFields($model, $data, ['title', 'description', 'property_type']);
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

    public function isOwner($userId, $id)
    {
        return $this->Model->conditions([
            'id' => (int) $id,
            'owner_id' => (int) $userId
        ])->exists();
    }

    public function shared($ownerId)
    {
        $result = [];

        $model = $this->Model
            ->with([
                'projectAccess' => function($query) use ($ownerId) {
                    $query->with('user')->where('user_id', '!=', (int) $ownerId)->get();
                }
            ])
            ->where('owner_id', (int) $ownerId)
            ->get(['id', 'title']);

        if ($model === null) {
            return $result;
        }

        foreach ($model as $project) {
            $info = [
                'id' => $project->id,
                'title' => $project->title,
                'access' => []
            ];

            if (!$project->projectAccess->isEmpty()) {
                foreach ($project->projectAccess as $access) {
                    $info['access'][] = [
                        'is_editable' => (bool) $access->is_editable,
                        'user' => [
                            'id' => $access->user_id,
                            'email' => $access->user->email
                        ]
                    ];
                }
            }

            $result[] = $info;
        }

        return $result;
    }
}