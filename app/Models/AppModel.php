<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppModel extends Model
{
    public function scopeConditions($query, array $conditions = []) {
        foreach ($conditions as $column => $value) {
            $query->where($column, $value);
        }

        return $query;
    }

    public function scopeLike($query, $field, $value)
    {
        return $query->where($field, 'LIKE', "%$value%");
    }
}