<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'package_id',
        'guide_id',
        'travel_date',
        'persons',
        'total_cost',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'travel_date' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function package()
    {
        return $this->belongsTo(TourPackage::class, 'package_id');
    }

    public function guide()
    {
        return $this->belongsTo(Guide::class);
    }

    public function itineraries()
    {
        return $this->hasMany(Itinerary::class);
    }
}
