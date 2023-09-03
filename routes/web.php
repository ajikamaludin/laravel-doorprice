<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\EventDrawController;
use App\Http\Controllers\GeneralController;
use App\Http\Controllers\GiftController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/draw/{event}/show', [EventDrawController::class, 'show'])->name('draw.show');
Route::get('/draw/{event}/export', [EventDrawController::class, 'export'])->name('draw.export');

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [GeneralController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/export', [GeneralController::class, 'export'])->name('dashboard.export');

    Route::get('/maintance', [GeneralController::class, 'maintance'])->name('maintance');

    // User
    Route::get('/users', [UserController::class, 'index'])->name('user.index');
    Route::post('/users', [UserController::class, 'store'])->name('user.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('user.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('user.destroy');

    // Role
    Route::resource('/roles', RoleController::class);

    // Setting
    Route::get('/settings', [SettingController::class, 'index'])->name('setting.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('setting.update');
    Route::post('/settings/profile', [SettingController::class, 'updateProfile'])->name('setting.profile');

    // Event
    Route::get('/events', [EventController::class, 'index'])->name('event.index');
    Route::post('/events', [EventController::class, 'store'])->name('event.store');
    Route::post('/events/{event}', [EventController::class, 'update'])->name('event.update');
    Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('event.destroy');

    // Gift
    Route::get('/gifts', [GiftController::class, 'index'])->name('gift.index');
    Route::post('/gifts', [GiftController::class, 'store'])->name('gift.store');
    Route::post('/gifts/{gift}', [GiftController::class, 'update'])->name('gift.update');
    Route::delete('/gifts/{gift}', [GiftController::class, 'destroy'])->name('gift.destroy');

    // Participant
    Route::get('/participants', [ParticipantController::class, 'index'])->name('participant.index');
    Route::get('/participants/import', [ParticipantController::class, 'importPage'])->name('participant.import');
    Route::post('/participants/import', [ParticipantController::class, 'importProccess']);
    Route::post('/participants', [ParticipantController::class, 'store'])->name('participant.store');
    Route::post('/participants/{participant}', [ParticipantController::class, 'update'])->name('participant.update');
    Route::delete('/participants/{participant}', [ParticipantController::class, 'destroy'])->name('participant.destroy');

    // Draw
    Route::get('/draw', [EventDrawController::class, 'index'])->name('draw.index');
    Route::get('/draw/{event}/main', [EventDrawController::class, 'main'])->name('draw.main');
    Route::get('/draw/{event}/reguler', [EventDrawController::class, 'reguler'])->name('draw.reguler');
    Route::post('/draw/{event}/main', [EventDrawController::class, 'storeMain'])->name('draw.store.main');
    Route::post('/draw/{event}/reguler', [EventDrawController::class, 'storeReguler'])->name('draw.store.reluger');
    Route::delete('/draw/{result}/reset', [EventDrawController::class, 'destroy'])->name('draw.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
