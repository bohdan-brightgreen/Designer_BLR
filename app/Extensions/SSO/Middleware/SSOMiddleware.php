<?php
namespace SSO\Middleware;

use Closure;
use SSO;

class SSOMiddleware
{
	/**
	 * Check if session is syncronised
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
        if (!session()->has('user')) {	
            return redirect()->away(SSO::getSSOUrl());
		}
return $next($request);
	}
}
