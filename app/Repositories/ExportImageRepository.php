<?php
namespace App\Repositories;

use App\Contracts\ExportImageInterface;
use App\Models\ExportImage;

class ExportImageRepository extends BaseRepository implements ExportImageInterface
{
    private $Model;

    public function __construct(ExportImage $model)
    {
        $this->Model = $model;
    }

    public function get($id)
    {
        $model = $this->Model->find($id);
        if ($model === null) {
            return false;
        }

        return $model->data;
    }

    public function add($data)
    {
        $id = str_random(10);
        $model = $this->Model->firstOrNew([
            'id' => $id
        ]);

        if ($model === null) {
            return null;
        }

        $model->data = $data;
        $model->save();

        return $id;
    }

    public function delete($id)
    {
        return $this->Model->destroy($id);
    }
}