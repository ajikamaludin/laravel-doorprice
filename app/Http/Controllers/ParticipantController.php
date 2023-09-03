<?php

namespace App\Http\Controllers;

use App\Imports\ParticipantImport;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ParticipantController extends Controller
{
    public function index(Request $request)
    {
        $query = Participant::query()->with(['event']);

        if ($request->q) {
            $query->where('name', 'like', "%{$request->q}%")
                ->orWhere('employee_code', 'like', "%{$request->q}%");
        }

        if ($request->event_id) {
            $query->where('event_id', $request->event_id);
        }

        $query->orderBy('created_at', 'desc');

        return inertia('Participant/Index', [
            'query' => $query->paginate(10),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'employee_code' => 'required|string',
            'name' => 'required|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'unit' => 'nullable|string',
            'agency' => 'nullable|string',
        ]);

        $participant = Participant::where('employee_code', Str::upper($request->employee_code))
            ->where('event_id', $request->event_id)
            ->exists();

        if ($participant) {
            session()->flash('message', ['type' => 'error', 'message' => 'NP sudah digunakan']);
            return;
        }

        Participant::create([
            'event_id' => $request->event_id,
            'employee_code' => Str::upper($request->employee_code),
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'unit' => $request->unit,
            'agency' => $request->agency,
        ]);

        return redirect()->route('participant.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function update(Request $request, Participant $participant)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'employee_code' => 'required|string',
            'name' => 'required|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'unit' => 'nullable|string',
            'agency' => 'nullable|string',
        ]);

        $p = Participant::where('employee_code', Str::upper($request->employee_code))
            ->where('event_id', $request->event_id)
            ->where('id', '<>', $participant->id)
            ->exists();

        if ($p) {
            session()->flash('message', ['type' => 'error', 'message' => 'NP sudah digunakan']);
            return;
        }

        $participant->update([
            'event_id' => $request->event_id,
            'employee_code' => Str::upper($request->employee_code),
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'unit' => $request->unit,
            'agency' => $request->agency,
        ]);

        return redirect()->route('participant.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(Participant $participant)
    {
        $participant->delete();

        return redirect()->route('participant.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }

    public function importPage()
    {
        return inertia('Participant/Import');
    }

    public function importProccess(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'file' => 'required|file',
        ]);

        // proccess import
        (new ParticipantImport($request->event_id))->import($request->file);

        return redirect()->route('participant.import')
            ->with('message', ['type' => 'success', 'message' => 'Item imported']);
    }
}
