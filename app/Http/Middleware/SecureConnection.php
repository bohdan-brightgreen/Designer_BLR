<?php
namespace App\Http\Middleware;

use Closure;

class SecureConnection {

	/**
	 * Redirect all HTTP requests to HTTPS.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		if (!$request->secure()) {
			return redirect()->secure($request->getRequestUri());
		}

		return $next($request);
	}

}
