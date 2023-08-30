<?php

namespace App\Models;


class EventGift extends Model
{
    protected $fillable = [
        'event_id',
        'name',
        'quota',
        'type',
        'image',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function result()
    {
        return $this->hasMany(EventResult::class);
    }
}
