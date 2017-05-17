<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    public $connection = 'sso';

    public $timestamps = false;

    protected $fillable = ['email'];

    protected $hidden = ['password', 'remember_token'];
}