<?php
namespace App\Contracts;

interface DesignInterface
{
    public function get($id, $deep = false);

    public function getByProjectId($projectId);

    public function getByField($field, $id);

    public function getProjectIds(array $id = []);

    public function create(array $data = []);

    public function update($id, array $data = []);

    public function delete($id);
}