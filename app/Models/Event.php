<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;

class Event extends Model
{
    protected $fillable = [
        'name',
        'date',
        'image',
    ];

    protected $appends = ['image_url'];

    public function gift()
    {
        return $this->hasMany(EventGift::class);
    }

    public function results()
    {
        return $this->hasMany(EventResult::class);
    }

    public function imageUrl(): Attribute
    {
        return Attribute::make(get: fn () => $this->image != null ? asset($this->image) : null);
    }
}
