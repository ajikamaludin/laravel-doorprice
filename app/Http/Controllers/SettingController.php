<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SettingController extends Controller
{
    public function index()
    {
        return inertia('Setting/Index', [
            'setting' => Setting::all(),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'app_name' => 'required|string',
            'text_footer' => 'nullable|string',
            'image' => 'nullable|image'
        ]);

        DB::beginTransaction();

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $image->store('uploads', 'public');
            Setting::where('key', 'app_logo')->update(['value' => $image->hashName('uploads')]);
        }

        foreach ($request->except(['image', 'image_url']) as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $value,
                    'type' => 'text',
                ]
            );
        }

        DB::commit();

        return redirect()->route('setting.index')
            ->with('message', ['type' => 'success', 'message' => 'Setting saved']);
    }

    public function updateProfile(Request $request)
    {
        $id = auth()->user()->id;
        $request->validate([
            'username' => 'required|string|unique:users,email,' . $id,
            'password' => 'nullable|confirmed'
        ]);

        $user = User::where('id', $id)->first();

        $user->email = $request->username;
        if ($request->password != null) {
            $user->password = bcrypt($request->password);
        }

        $user->save();

        return redirect()->route('setting.index')
            ->with('message', ['type' => 'success', 'message' => 'User updated']);
    }
}
