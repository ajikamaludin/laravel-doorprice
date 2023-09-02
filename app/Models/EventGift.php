<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;

class EventGift extends Model
{
    const TYPE_1ST = 0;

    const TYPE_2ND = 1;

    const TYPES = [
        self::TYPE_1ST => 'Utama',
        self::TYPE_2ND => 'Reguler',
    ];

    protected $fillable = [
        'event_id',
        'name',
        'quota',
        'type',
        'image',
    ];

    protected $appends = ['image_url', 'type_text'];

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function result()
    {
        return $this->hasMany(EventResult::class);
    }

    public function imageUrl(): Attribute
    {
        return Attribute::make(get: fn () => $this->image != null ? asset($this->image) : null);
    }

    public function typeText(): Attribute
    {
        return Attribute::make(get: fn () => self::TYPES[$this->type]);
    }
}
