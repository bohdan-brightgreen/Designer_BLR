<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Services\ProjectService;
use App\Contracts\ProjectAccessInterface;

class ProjectAccessController extends Controller
{
    private $ProjectService;

    private $ProjectAccess;

    public function __construct(
        ProjectService $projectService,
        ProjectAccessInterface $projectAccess
    ) {
        $this->middleware('sso');
        $this->ProjectService = $projectService;
        $this->ProjectAccess = $projectAccess;
    }

    /**
     * Get shared projects
     *
     * @return string JSON
     */
    public function all()
    {
        $result = $this->ProjectService->getSharedProject();

        return response()->json($result);
    }

    /**
     * Share project
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    public function store(Request $request)
    {
        // TODO: send email that user has shared a project
        $result = false;
        $data = $request->only('project_id', 'email', 'is_editable');
        if ($this->ProjectService->isOwner($data['project_id'])) {
            $userId = $this->ProjectService->getUserIdByEmail($data['email']);
            $result = $this->ProjectAccess->add($data['project_id'], $userId, $data['is_editable']);
        }

        return response()->json((bool) $result);
    }

    /**
     * Update user's access to a project
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    public function update(Request $request)
    {
        $result = false;
        $data = $request->only('project_id', 'user_id', 'is_editable');
        if ($this->ProjectService->isOwner($data['project_id'])) {
            $result = $this->ProjectAccess->update($data);
        }

        return response()->json((bool) $result);
    }

    /**
     * Remove user's access to a project
     *
     * @param  integer  $projectId  Project ID
     * @param  integer  $userId     User ID
     * @return bool
     */
    public function destroy($projectId, $userId)
    {
        $result = false;
        if ($this->ProjectService->isOwner($projectId)) {
            $result = $this->ProjectAccess->delete($projectId, $userId);
        }

        return response()->json((bool) $result);
    }
}