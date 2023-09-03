<?php

namespace App\Http\Controllers;

use App\Exports\EventResultExport;
use App\Models\Event;
use App\Models\EventGift;
use App\Models\EventResult;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EventDrawController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::query();

        if ($request->q) {
            $query->where('name', 'like', "%{$request->q}%");
        }

        $query->orderBy('created_at', 'desc');

        return inertia('EventDraw/Index', [
            'query' => $query->paginate(10),
        ]);
    }

    public function show(Request $request, Event $event)
    {
        $query = EventResult::where('event_id', $event->id)->with(['participant', 'gift']);

        if ($request->q != '') {
            $query->whereHas('participant', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->q}%");
            });
        }

        return inertia('EventDraw/Result', [
            'event' => $event,
            'query' => $query->paginate(),
        ]);
    }

    public function main(Event $event)
    {
        $participants = Participant::inRandomOrder()
            ->where('event_id', $event->id)
            ->limit(200)
            ->get();

        // find the winner
        $winner = Participant::where('event_id', $event->id)
            ->whereNotIn('id', function ($q) {
                $q->select('participan_id')->from('event_results');
            })
            ->get();

        srand(date('s'));
        $num = rand(0, $winner->count() - 1);
        $winner = $winner->toArray()[$num];

        return inertia('EventDraw/Main', [
            'event' => $event,
            'participants' => $participants,
            '_winner' => $winner,
        ]);
    }

    public function reguler(Event $event)
    {
        return inertia('EventDraw/Regular', [
            'event' => $event
        ]);
    }

    public function storeMain(Request $request, Event $event)
    {
        $request->validate([
            'gift_id' => 'required|exists:event_gifts,id',
            'participant_id' => 'required|exists:participants,id',
        ]);

        $result = EventResult::where('event_id', $event->id)
            ->where('participant_id', $request->participant_id)
            ->count();

        if ($result != 0) {
            return redirect()->back()
                ->with('message', ['type' => 'error', 'message' => 'Sudah memenangkan hadiah']);
        }

        $result = EventResult::where('event_id', $event->id)
            ->where('gift_id', $request->gift_id)
            ->count();

        $gift = EventGift::find($request->gift_id);

        if ($result >= $gift->quota) {
            return redirect()->back()
                ->with('message', ['type' => 'error', 'message' => 'Kuota Hadiah Habis']);
        }

        EventResult::create([
            'event_id' => $event->id,
            'gift_id' => $request->gift_id,
            'participant_id' => $request->participant_id,
        ]);

        session()->flash('message', ['type' => 'success', 'message' => 'Item has been saved']);
    }

    public function storeReguler(Request $request, Event $event)
    {
        $request->validate([
            'gift_id' => 'required|exists:event_gifts,id',
            'participants' => 'required|array',
            'participants.*.id' => 'required|exists:participants,id'
        ]);

        $participants = collect($request->participants)->pluck('id')->toArray();

        $result = EventResult::where('event_id', $event->id)
            ->whereIn('participant_id', $participants)
            ->count();

        if ($result != 0) {
            return redirect()->back()
                ->with('message', ['type' => 'error', 'message' => 'Sudah memenangkan hadiah']);
        }

        $result = EventResult::where('event_id', $event->id)
            ->where('gift_id', $request->gift_id)
            ->count();

        $gift = EventGift::find($request->gift_id);

        $check = ($gift->quota - $result) - count($participants);

        if ($check < 0) {
            return redirect()->back()
                ->with('message', ['type' => 'error', 'message' => 'Kuota Hadiah Habis']);
        }

        DB::beginTransaction();
        foreach ($participants as $p) {
            info('debug', [
                'event_id' => $event->id,
                'gift_id' => $request->gift_id,
                'participant_id' => $p
            ]);
            EventResult::create([
                'event_id' => $event->id,
                'gift_id' => $request->gift_id,
                'participant_id' => $p,
            ]);
        }
        DB::commit();

        session()->flash('message', ['type' => 'success', 'message' => 'Item has been saved']);
    }

    public function export(Event $event)
    {
        $query = EventResult::where('event_id', $event->id)->with(['participant', 'gift'])->get();

        $result = [['NP', 'NAMA', 'NO TELP', 'UNIT KERJA', 'HADIAH', 'JENIS HADIAH']];

        foreach ($query as $q) {
            $result[] = [
                $q->participant->employee_code,
                $q->participant->name,
                $q->participant->phone,
                $q->participant->unit,
                $q->gift->name,
                $q->gift->type_text,
            ];
        }

        $date = Str::slug($event->name) . "-" . now()->format('d-m-Y');
        return (new EventResultExport(collect($result)))->download("result-$date.xlsx");
    }

    public function destroy(EventResult $result)
    {
        $result->delete();

        session()->flash('message', ['type' => 'success', 'message' => 'Item has been reset']);
    }
}
