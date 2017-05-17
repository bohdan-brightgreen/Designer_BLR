<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Services\ProjectService;

class ExportImageController extends Controller
{
    private $ProjectService;

    public function __construct(
        ProjectService $projectService
    ) {
        $this->middleware('sso');
        $this->ProjectService = $projectService;
    }
    
    /**
     * Save exported image
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string
     */
    public function store(Request $request)
    {
	
	// echo "<script>(function(){alert('$request->only('data')');})();</script>";
	
		
		$id = $this->ProjectService->saveExportedImage($request->only('data'));
        
        return response()->json($id);
    }
}