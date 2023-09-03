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
        // find the winner
        $participants = Participant::where('event_id', $event->id)
            ->whereNotIn('id', function ($q) {
                $q->select('participant_id')->from('event_results');
            })
            ->get();

        $indexs = collect();
        $quota = $request->quota;
        srand(date('s'));
        while ($quota > 0) {
            $num = rand(0, $participants->count() - 1);
            $has = $indexs->search($num);
            if (!$has) {
                $indexs->add($num);
                $quota -= 1;
            }
        }

        $winners = collect();
        foreach ($indexs as $i) {
            $winners->add($participants->toArray()[$i]);
        }

        return response()->json($winners);
    }
}
