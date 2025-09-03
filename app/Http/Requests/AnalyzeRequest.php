<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AnalyzeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'cv' => 'required|file|mimes:pdf,rtf,txt|max:2048',
            'vacancy' => array_merge(['required'], request()->hasFile('vacancy') ? ['mimes:pdf,rtf,txt', 'max:2048'] : ['string']),
        ];
    }

    public function attributes(): array
    {
        return [
            'cv' => 'CV',
            'vacancy' => 'Job Vacancy',
            'vacancy_text' => 'Job Vacancy',
        ];
    }
}
