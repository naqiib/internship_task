<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TourPackage extends Model
{
    use HasFactory;

    protected $table = 'tour_packages';

    protected $fillable = [
        'destination_id',
        'title',
        'description',
        'duration',
        'price',
        'included_services',
        'availability',
    ];

    protected function casts(): array
    {
        return [
            'availability' => 'boolean',
        ];
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'package_id');
    }
}
