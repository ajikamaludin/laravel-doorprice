<?php

namespace App\Models;


class Participant extends Model
{
    protected $fillable = [
        'event_id',
        'employee_code',
        'name',
        'phone',
        'email',
        'unit',
        'agency',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }
}
