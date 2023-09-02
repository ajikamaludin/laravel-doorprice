<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::query();

        if ($request->q) {
            $query->where('name', 'like', "%{$request->q}%");
        }

        $query->orderBy('created_at', 'desc');

        return inertia('Event/Index', [
            'query' => $query->paginate(10),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'image' => 'nullable|image',
        ]);

        $event = Event::make([
            'name' => $request->name,
            'date' => $request->date,
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $image->store('uploads', 'public');
            $event->image = $image->hashName('uploads');
        }

        $event->save();

        return redirect()->route('event.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function update(Request $request, Event $event)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'image' => 'nullable|image',
        ]);

        $event->fill([
            'name' => $request->name,
            'date' => $request->date,
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $image->store('uploads', 'public');
            $event->image = $image->hashName('uploads');
        }

        $event->save();

        return redirect()->route('event.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return redirect()->route('event.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }
}
