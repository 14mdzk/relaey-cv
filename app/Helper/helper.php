<?php

namespace App\Helper;

use Throwable;

if (!function_exists('error_context')) {
    function error_context(Throwable $e)
    {
        return [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
        ];
    }
}
