<?php
namespace App\Contracts;

interface UserInterface
{
    public function info(array $id = []);

    public function getIdByEmail($email);

    public function create($email, $name = '');
}