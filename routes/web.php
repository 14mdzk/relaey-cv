<?php

use App\Http\Controllers\AnalyzeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => Inertia::render('home/index'))->name('home.index');
Route::get('/analyze', [AnalyzeController::class, 'index'])->name('analyze.index');
