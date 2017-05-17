<?php
namespace App\Models;

class Project extends AppModel
{
    public $timestamps = false;

    protected $fillable = ['uid', 'title', 'owner_id'];

    public function design()
    {
        return $this->hasMany(__NAMESPACE__ . '\Design');
    }

    public function projectAccess()
    {
        return $this->hasMany(__NAMESPACE__ . '\ProjectAccess');
    }

    public static function boot()
    {
        static::creating(function($model)
        {
            $model->created = $model->freshTimestamp();
        });

        static::updating(function($model)
        {
            $model->modified = $model->freshTimestamp();
        });
    }
}