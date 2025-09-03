<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompareRequest;
use Gemini\Data\SafetySetting;
use Gemini\Enums\HarmBlockThreshold;
use Gemini\Enums\HarmCategory;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AnalyzeController extends Controller
{
    public function index()
    {
        return Inertia::render('analyze/index');
    }
}
