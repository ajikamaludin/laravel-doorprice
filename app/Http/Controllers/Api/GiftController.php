<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EventGift;
use Illuminate\Http\Request;

class GiftController extends Controller
{
    public function index(Request $request)
    {
        $query = EventGift::query()->with(['result.participant']);

        if ($request->has('q')) {
            $query->where('name', 'like', "%{$request->q}%");
        }

        if ($request->type != '') {
            $query->where('type', $request->type);
        }

        if ($request->event_id != '') {
            $query->where('event_id', $request->event_id);
        }

        return $query->get();
    }
}
