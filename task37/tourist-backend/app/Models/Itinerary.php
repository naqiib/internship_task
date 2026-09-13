<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Itinerary extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'day',
        'title',
        'description',
        'activity_time',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
