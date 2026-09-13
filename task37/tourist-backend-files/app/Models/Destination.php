<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'location',
        'description',
        'estimated_cost',
        'best_season',
        'latitude',
        'longitude',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function packages()
    {
        return $this->hasMany(TourPackage::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function favouritedBy()
    {
        return $this->hasMany(Favourite::class);
    }
}
