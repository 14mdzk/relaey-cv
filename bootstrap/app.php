<?php

use App\Http\Middleware\ContextMiddleware;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\CustomHeaderMiddleware;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            ContextMiddleware::class,
            HandleInertiaRequests::class,
        ]);
        $middleware->api(append: [
            EncryptCookies::class,
            CustomHeaderMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
