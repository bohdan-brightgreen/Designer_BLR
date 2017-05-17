<?php
namespace App\Repositories;

use App\Contracts\UserInterface;
use App\Models\User;

class UserRepository extends BaseRepository implements UserInterface
{
    private $Model;

    public function __construct(User $model)
    {
        $this->Model = $model;
    }

    public function info(array $id = [])
    {
        $result = [];

        $model = $this->Model->whereIn('id', $id)->get(['id', 'name', 'email']);
        if ($model === null) {
            return $result;
        }

        foreach ($model as $value) {
            $result[ $value->id ] = $value->toArray();
        }

        return $result;
    }

    public function getIdByEmail($email)
    {
        $email = $this->prepareEmail($email);

        $model = $this->Model->where('email', $email)->first(['id']);

        return ($model === null) ? null : $model->id;
    }

    public function create($email, $name = '') {
        $email = $this->prepareEmail($email);
        if (empty($email)) {
            return null;
        }

        $model = $this->Model->firstOrCreate(['email' => $email]);
        if ($model === null) {
            return null;
        }

        if (!empty($name)) {
            $model->name = $name;
        }
        $model->is_active = 0;

        $model->save();

        return $model->id;
    }
}