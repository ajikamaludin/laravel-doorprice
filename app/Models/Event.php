<?php

namespace App\Models;

class Event extends Model
{
    protected $fillable = [
        'name',
        'date',
        'image',
    ];

    public function gift()
    {
        return $this->hasMany(EventGift::class);
    }
}
