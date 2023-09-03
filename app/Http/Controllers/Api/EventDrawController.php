<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\Request;

class EventDrawController extends Controller
{
    public function reguler(Request $request, Event $event)
    {
        $exceptIds = collect($request->except_id)->toArray();

        // find the winner
        $participants = Participant::inRandomOrder()
            ->where('event_id', $event->id)
            ->whereNotIn('id', function ($q) {
                $q->select('participant_id')->from('event_results');
            })
            ->whereNotIn('id', $exceptIds)
            ->limit($request->quota)
            ->first();

        return response()->json($participants);
    }
}
