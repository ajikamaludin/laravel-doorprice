<?php

namespace App\Models;

class EventResult extends Model
{
    protected $fillable = [
        'event_id',
        'gift_id',
        'participan_id',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }
}
