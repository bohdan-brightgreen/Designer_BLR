<?php
namespace App\Http\Controllers;

use Request;
use App\Services\ProjectService;

class DesignsController extends Controller
{
    private $ProjectService;

    public function __construct(
        ProjectService $projectService
    ) {
        $this->middleware('sso');
        $this->ProjectService = $projectService;
    }

    /**
     * GET /designs/[PROJECT_ID]
     *
     * @param integer $projectId Project ID
     * @return string JSON
     */
    public function all($projectId)
    {
        $result = $this->ProjectService->designs($projectId);

        return response()->json($result);
    }

    /**
     * GET /design/[DESIGN_ID]
     *
     * @param integer $id Design ID
     * @return string JSON
     */
    public function show($id)
    {
        $result = $this->ProjectService->design($id);

        return response()->json($result);
    }

    /**
     * POST /design
     *
     * @return string JSON
     */
    public function store()
    {
        $result = $this->ProjectService->createDesign(Request::all());

        return response()->json($result);
    }

    /**
     * PUT /design
     *
     * @return string JSON
     */
    public function update()
    {
        $result = $this->ProjectService->updateDesign(Request::all());

        return response()->json($result);
    }

    /**
     * DELETE /design/[DESIGN_ID]
     *
     * @param integer $id Design ID
     * @return string JSON
     */
    public function destroy($id)
    {
        $result = $this->ProjectService->deleteDesign($id);

        return response()->json($result);
    }
}