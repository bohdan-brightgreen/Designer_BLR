<?php
namespace App\Http\Controllers;

use Request;
use App\Services\ProjectService;

class ProjectsController extends Controller
{
    private $ProjectService;

    public function __construct(
        ProjectService $projectService
    ) {
        $this->middleware('sso');
        $this->ProjectService = $projectService;
    }

    /**
     * GET /projects
     *
     * @param boolean ?structure (optional) Indicator of full project structure or not
     * @return string JSON
     */
    public function all()
    {
        //$isStructured = (bool) Request::input('structure', false);
        //$result = $this->ProjectService->projects($isStructured);
        $result = $this->ProjectService->projects();

        return response()->json($result);
    }

    /**
     * GET /project/[PROJECT_ID]
     *
     * @param integer $id Project ID
     * @param boolean ?structure (optional) Indicator of full project structure or not
     * @return string JSON
     */
    public function show($id)
    {
        //$isStructured = (bool) Request::input('structure', false);
        //$result = $this->ProjectService->project($id, $isStructured);
        $result = $this->ProjectService->project($id);

        return response()->json($result);
    }

    /**
     * POST /project
     *
     * @return string JSON
     */
    public function store()
    {
        $result = $this->ProjectService->createProject(Request::all());

        return response()->json($result);
    }

    /**
     * PUT /project
     *
     * @return string JSON
     */
    public function update()
    {
        $result = $this->ProjectService->updateProject(Request::all());

        return response()->json($result);
    }

    /**
     * DELETE /project/[PROJECT_ID]
     *
     * @param integer $id Project ID
     * @return string JSON
     */
    public function destroy($id)
    {
        $result = $this->ProjectService->deleteProject($id);

        return response()->json($result);
    }
}