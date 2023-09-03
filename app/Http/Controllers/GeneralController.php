<?php

namespace App\Http\Controllers;

use App\Exports\EventResultExport;
use App\Models\EventGift;
use App\Models\EventResult;
use App\Models\Participant;
use Illuminate\Http\Request;

class GeneralController extends Controller
{
    public function index(Request $request)
    {
        $query = EventResult::query()->with(['participant', 'gift']);

        $participant = Participant::query();
        $eventgift = EventGift::query();
        $result = EventResult::query();

        if ($request->event_id != '') {
            $query->where('event_id', $request->event_id);
            $participant->where('event_id', $request->event_id);
            $eventgift->where('event_id', $request->event_id);
            $result->where('event_id', $request->event_id);
        }

        if ($request->q != '') {
            $query->whereHas('participant', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->q}%");
            });
        }

        return inertia('Dashboard', [
            'query' => $query->paginate(),
            'participant' => $participant->count(),
            'eventgift' => $eventgift->sum('quota'),
            'result' => $result->count(),
        ]);
    }

    public function export(Request $request)
    {
        $query = EventResult::query()->with(['participant', 'gift', 'event'])->get();

        if ($request->event_id != '') {
            $query->where('event_id', $request->event_id);
        }

        $result = [['NP', 'NAMA', 'NO TELP', 'UNIT KERJA', 'HADIAH', 'JENIS HADIAH', 'EVENT']];

        foreach ($query as $q) {
            $result[] = [
                $q->participant->employee_code,
                $q->participant->name,
                $q->participant->phone,
                $q->participant->unit,
                $q->gift->name,
                $q->gift->type_text,
                $q->event->name,
            ];
        }

        $date = now()->format('d-m-Y');

        return (new EventResultExport(collect($result)))->download("result-$date.xlsx");
    }

    public function maintance()
    {
        return inertia('Maintance');
    }
}
