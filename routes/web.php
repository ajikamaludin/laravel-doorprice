<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\GeneralController;
use App\Http\Controllers\GiftController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingController;
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

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [GeneralController::class, 'index'])->name('dashboard');
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
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
