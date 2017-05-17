<?php
namespace App\Contracts;

interface ProjectInterface
{
    public function get($id);

    public function create($ownerId, array $data);

    public function update($id, array $data = []);

    public function delete($id);

    public function isOwner($userId, $id);

    public function shared($ownerId);
}