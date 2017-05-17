<?php
namespace App\Contracts;

interface ExportImageInterface
{
    public function get($id);
    
    public function add($data);

    public function delete($id);
}