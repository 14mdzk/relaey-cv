<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnalyzeRequest;
use Gemini\Data\Blob;
use Gemini\Data\Content;
use Gemini\Data\GenerationConfig;
use Gemini\Data\Part;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Storage;
use Gemini\Data\SafetySetting;
use Gemini\Data\UploadedFile;
use Gemini\Enums\HarmBlockThreshold;
use Gemini\Enums\HarmCategory;
use Gemini\Enums\MimeType;
use Gemini\Enums\ResponseMimeType;
use Gemini\Exceptions\ErrorException;
use Gemini\Laravel\Facades\Gemini;

use function App\Helper\error_context;

class AnalyzeController extends Controller
{
    public function upload(AnalyzeRequest $request)
    {
        $id = Cookie::get('X-Current-ID');
        if (empty($id)) {
            return response()->json([
                'message' => 'Not Found',
            ], 404);
        }
        if (Storage::exists($id)) {
            Storage::deleteDirectory($id);
        }

        $uploadState = false;
        if ($request->hasFile('cv')) {
            $file = $request->file('cv');
            $uploadState = Storage::putFileAs($id, $file, 'cv.' . $file->getClientOriginalExtension());
        }

        if ($request->hasFile('vacancy')) {
            $file = $request->file('vacancy');
            $uploadState = Storage::putFileAs($id, $file, 'vacancy.' . $file->getClientOriginalExtension());
        } else {
            $uploadState = Storage::put($id . '/vacancy.txt', $request->vacancy);
        }

        return response()->json([
            'message' => $uploadState ? 'File uploaded successfully' : 'An error occurred while uploading your file.',
        ], $uploadState ? 200 : 400);
    }

    public function process()
    {
        $id = Cookie::get('X-Current-ID');
        if (empty($id)) {
            abort(403);
        }

        if (!Storage::exists($id)) {
            abort(404);
        }

        $files = Storage::files($id);
        try {
            $parts = [
                new Blob($this->getMimeType(base_path('context.md')), base64_encode(file_get_contents(base_path('context.md')))),
                ...array_map(fn($file) => new Blob($this->getMimeType($file), base64_encode(Storage::get($file))), $files)
            ];

            $result = $this->generate($parts);
            Storage::deleteDirectory($id);

            throw_if(
                empty($result),
                new \Exception('An error occurred while analyzing your briliant cv.')
            );

            return response()->json(['message' => 'ok', 'data' => $result], 200);
        } catch (\Throwable $th) {
            logger()->error('[API/AnalyzeController] ' . $th->getMessage(), error_context($th));
            return response()->json([
                'message' => 'An error occurred while analyzing your briliant cv.',
            ], 500);
        }
    }

    protected function generate($parts, $retry = 0): mixed
    {
        $safetySettingDangerousContent = new SafetySetting(
            category: HarmCategory::HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold::BLOCK_ONLY_HIGH
        );

        $safetySettingHateSpeech = new SafetySetting(
            category: HarmCategory::HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold::BLOCK_ONLY_HIGH
        );

        try {
            $response = Gemini::generativeModel(model: 'gemini-2.0-flash')
                ->withGenerationConfig(
                    generationConfig: new GenerationConfig(
                        responseMimeType: ResponseMimeType::APPLICATION_JSON
                    )
                )
                ->withSafetySetting($safetySettingDangerousContent)
                ->withSafetySetting($safetySettingHateSpeech)
                ->generateContent(...$parts);

            return $response->json();
        } catch (\Throwable $th) {
            logger()->error('[API/AnalyzeController] ' . $th->getMessage(), error_context($th));
            if ($th instanceof ErrorException) {
                if ($retry < 3) {
                    return $this->generate($parts, $retry + 1);
                }
            }

            return false;
        }
    }

    protected function getMimeType($file): MimeType|bool
    {
        if (empty($file)) return false;
        $extension = explode('.', $file);

        return match ($extension[count($extension) - 1]) {
            'md' => MimeType::TEXT_MARKDOWN,
            'pdf' => MimeType::APPLICATION_PDF,
            'rtf' => MimeType::APPLICATION_RTF,
            'txt' => MimeType::TEXT_PLAIN,
            default => false,
        };
    }
}
