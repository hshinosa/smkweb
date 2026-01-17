<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        // TEMPORARILY DISABLED FOR TROUBLESHOOTING
        return $next($request);

        /** @var Response $response */
        $response = $next($request);

        $host = $request->getHost();
        $isDevHost = in_array($host, ['localhost', '127.0.0.1', '[::1]']);
        $isLocal = app()->environment('local') || app()->environment('testing') || $isDevHost;

        // Dev/test/local host: jangan set CSP supaya Vite/inline script tidak diblokir saat pengembangan.
        if ($isLocal) {
            return $response;
        }

        $csp = [
            "default-src 'self'",
            "img-src 'self' data: blob: https: http:",
            "font-src 'self' https://fonts.gstatic.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
            "script-src-elem 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
            "script-src-attr 'self' 'unsafe-inline'",
            "connect-src 'self' https://cloudflareinsights.com",
            "frame-src 'self' https://www.google.com https://maps.google.com",
            "frame-ancestors 'self'",
            'upgrade-insecure-requests',
        ];

        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        $response->headers->set('Cross-Origin-Resource-Policy', 'same-origin');
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
        $response->headers->set('Content-Security-Policy', implode('; ', $csp));
        
        // HSTS (HTTP Strict Transport Security)
        // Max-age: 1 year (31536000 seconds)
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

        return $response;
    }
}
