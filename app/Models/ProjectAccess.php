<?php
namespace App\Models;

class ProjectAccess extends AppModel
{
    public $timestamps = false;

    protected $fillable = ['project_id', 'user_id'];

    public function project()
    {
        return $this->belongsTo(__NAMESPACE__ . '\Project');
    }

    public function user()
    {
        return $this->belongsTo(__NAMESPACE__ . '\User');
    }
}