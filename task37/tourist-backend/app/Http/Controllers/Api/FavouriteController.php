<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favourite;
use Illuminate\Http\Request;

class FavouriteController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->favourites()->with('destination')->get()
        );
    }

    public function store(Request $request, int $destinationId)
    {
        $favourite = Favourite::firstOrCreate([
            'user_id' => $request->user()->id,
            'destination_id' => $destinationId,
        ]);

        return response()->json($favourite, 201);
    }

    public function destroy(Request $request, int $destinationId)
    {
        Favourite::where('user_id', $request->user()->id)
            ->where('destination_id', $destinationId)
            ->delete();

        return response()->json(['message' => 'Removed from favourites.']);
    }
}
