<?php
namespace App\Models;

class ExportImage extends AppModel
{
    public $timestamps = false;

    protected $fillable = ['id'];

    public static function boot()
    {
        static::creating(function($model)
        {
            $model->created = $model->freshTimestamp();
        });
    }
}