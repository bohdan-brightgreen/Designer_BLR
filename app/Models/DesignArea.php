<?php
namespace App\Models;

class DesignArea extends AppModel
{
    public $timestamps = false;

    protected $fillable = ['design_id', 'title'];

    public function design()
    {
        return $this->belongsTo(__NAMESPACE__ . '\Design');
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