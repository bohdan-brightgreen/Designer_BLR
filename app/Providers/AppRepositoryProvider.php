<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppRepositoryProvider extends ServiceProvider {

	/**
	 * Bootstrap any application repositories.
	 *
	 * @return void
	 */
	public function boot()
	{
	    //
	}

	/**
	 * Register any application repositories.
	 *
	 * @return void
	 */
	public function register()
	{
		$models = [
			'User',
			'Project',
			'ProjectAccess',
			'DesignArea',
			'Design',
            'ExportImage'
		];
		
		foreach ($models as $model) {
			$this->app->bind("App\\Contracts\\{$model}Interface", "App\\Repositories\\{$model}Repository");
		}
	}

}
