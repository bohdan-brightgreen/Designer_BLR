<?php
namespace App\Http\Controllers;

use Request;
use App\Services\ProjectService;

class AreasController extends Controller
{
    private $ProjectService;

    public function __construct(
        ProjectService $projectService
    ) {
        $this->middleware('sso');
        $this->ProjectService = $projectService;
    }

    /**
     * GET /areas/[DESIGN_ID]
     *
     * @param integer $designId Design ID
     * @return string JSON
     */
    public function all($designId)
    {
        $result = $this->ProjectService->areas($designId);

        return response()->json($result);
    }

    /**
     * GET /area/[AREA_ID]
     *
     * @param integer $id DesignArea ID
     * @return string JSON
     */
    public function show($id)
    {
        $result = $this->ProjectService->area($id);

        return response()->json($result);
    }

    /**
     * POST /area
     *
     * @param boolean ?isContinue (optional) Indicator of create/update area
     * @return string JSON
     */
    public function store()
    {
        $isContinue = (bool) Request::input('isContinue', false);

        if ($isContinue) {
            $result = $this->ProjectService->updateArea(Request::all());

        } else {
            $result = $this->ProjectService->createArea(Request::all());
        }

        return response()->json($result);
    }

    /**
     * PUT /area
     *
     * @return string JSON
     */
    public function update()
    {
        $result = $this->ProjectService->updateArea(Request::all());

        return response()->json($result);
    }

    /**
     * DELETE /area/[AREA_ID]
     *
     * @param integer $id DesignArea ID
     * @return string JSON
     */
    public function destroy($id)
    {
        $result = $this->ProjectService->deleteArea($id);

        return response()->json($result);
    }
}