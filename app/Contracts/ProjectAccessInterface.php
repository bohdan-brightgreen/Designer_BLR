<?php
namespace App\Contracts;

interface ProjectAccessInterface
{
    public function userProjects($userId);

    public function add($projectId, $userId, $isEditable = false);

    public function update(array $data);

    public function delete($projectId, $userId);
}