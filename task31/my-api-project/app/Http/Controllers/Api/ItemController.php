<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;

class ItemController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Item::all()
        ], 200);
    }
}