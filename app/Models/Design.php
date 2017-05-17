<?php
namespace App\Models;

class Design extends AppModel
{
    public $timestamps = false;

    protected $fillable = ['project_id', 'title', 'description'];

    public function designArea()
    {
        return $this->hasMany(__NAMESPACE__ . '\DesignArea');
    }

    public function project()
    {
        return $this->belongsTo(__NAMESPACE__ . '\Project');
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