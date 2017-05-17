<?php
namespace App\Contracts;

interface DesignAreaInterface
{
	public function get($id);

    public function getByDesignId($designId);

    public function projectId($id);

    public function create($userId, array $data = []);

    public function update($id, $userId, array $data = []);

    public function delete($id);

    public function lock($id, $userId);

    public function unlock($id);

    public function isLocked($id, $currentUserId);
}