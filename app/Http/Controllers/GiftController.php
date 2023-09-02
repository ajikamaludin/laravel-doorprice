<?php

namespace App\Http\Controllers;

use App\Models\EventGift;
use Illuminate\Http\Request;

class GiftController extends Controller
{
    public function index(Request $request)
    {
        $query = EventGift::query()->with(['event']);

        if ($request->q) {
            $query->where('name', 'like', "%{$request->q}%");
        }

        $query->orderBy('created_at', 'desc');

        return inertia('EventGift/Index', [
            'query' => $query->paginate(10),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string',
            'quota' => 'required|numeric',
            'type' => 'required|in:0,1',
            'image' => 'nullable|image',
        ]);

        $gift = EventGift::make([
            'event_id' => $request->event_id,
            'name' => $request->name,
            'quota' => $request->quota,
            'type' => $request->type,
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $image->store('uploads', 'public');
            $gift->image = $image->hashName('uploads');
        }

        $gift->save();

        return redirect()->route('gift.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function update(Request $request, EventGift $gift)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string',
            'quota' => 'required|numeric',
            'type' => 'required|in:0,1',
            'image' => 'nullable|image',
        ]);

        $gift->fill([
            'event_id' => $request->event_id,
            'name' => $request->name,
            'quota' => $request->quota,
            'type' => $request->type,
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $image->store('uploads', 'public');
            $gift->image = $image->hashName('uploads');
        }

        $gift->save();

        return redirect()->route('gift.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(EventGift $gift)
    {
        $gift->delete();

        return redirect()->route('gift.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }
}
