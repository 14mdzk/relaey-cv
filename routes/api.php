<?php

use App\Http\Controllers\API\AnalyzeController;
use Illuminate\Support\Facades\Route;

Route::post('/analyze/upload', [AnalyzeController::class, 'upload'])->name('analyze.upload');
Route::post('/analyze/process', [AnalyzeController::class, 'process'])->name('analyze.process');
