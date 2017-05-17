<?php
namespace App\Services;

use App\Contracts\UserInterface;
use App\Contracts\ProjectInterface;
use App\Contracts\ProjectAccessInterface;
use App\Contracts\DesignInterface;
use App\Contracts\DesignAreaInterface;
use App\Contracts\ExportImageInterface;

class ProjectService
{
    private $errors = [
        'loginError'      => [401 => 'Unauthorized'],
        'notEditable'     => [403 => 'Forbidden'],
        'missedArguments' => [412 => 'Precondition Failed'],
        'locked'          => [423 => 'Locked'],
        'failed'          => [400 => 'Bad Request'],
        'unknown'         => [400 => 'Bad Request']
    ];

    public function __construct(
        UserInterface $user,
        ProjectInterface $project,
        ProjectAccessInterface $projectAccess,
        DesignInterface $design,
        DesignAreaInterface $designArea,
        ExportImageInterface $exportImage
    ) {
        $this->User = $user;
        $this->Project = $project;
        $this->ProjectAccess = $projectAccess;
        $this->Design = $design;
        $this->DesignArea = $designArea;
        $this->ExportImage = $exportImage;
    }

    public function userProjects()
    {
        $user = auth()->user();
        if ($user === null) {
            return [];
        }

        return $this->ProjectAccess->userProjects($user->id);
    }

    public function projects()
    {
        $userProjects = $this->userProjects();
        $data = $this->Project->get(array_keys($userProjects));

        $result = $this->prepareProjectData($data, $userProjects);

        return $result;
    }

    public function project($id)
    {
        $userProjects = $this->userProjects();
        if (!isset($userProjects[$id])) {
            return [];
        }

        $data = $this->Project->get($id);

        $result = $this->prepareProjectData($data, $userProjects);
        $result = reset($result);

        if (!empty($result)) {
            $result['designs'] = $this->designs($id);
        }

        return $result;
    }

    public function designs($projectId)
    {
        $userProjects = $this->userProjects();
        $data = $this->Design->getByProjectId($projectId);

        return $this->prepareDesignData($data, $userProjects);
    }

    public function design($id)
    {
        $userProjects = $this->userProjects();
        $data = $this->Design->get($id, true);

        $result = $this->prepareDesignData($data, $userProjects);

        return reset($result);
    }

    public function areas($designId)
    {
        $userProjects = $this->userProjects();
        $data = $this->DesignArea->getByDesignId($designId);

        return $this->prepareAreaData($data, $userProjects);
    }

    public function area($id)
    {
        $userProjects = $this->userProjects();
        $data = $this->DesignArea->get($id);

        $result = $this->prepareAreaData($data, $userProjects);

        return reset($result);
    }

    public function createProject($data)
    {
        $clientId = null;
        $user = auth()->user();
        if ($user === null) {
            return $this->error('loginError');
        }

        if (!empty($data['client_email'])) {
            $clientId = $this->User->getIdByEmail($data['client_email']);

            if ($clientId === null && !empty($data['client_name'])) {
                $clientId = $this->User->create($data['client_email'], $data['client_name']);
            }
        }

        if ($clientId === null) {
            $clientId = $user->id;
        }

        $data['original_owner_id'] = $clientId;

        $projectId = $this->Project->create($user->id, $data);
        if ($projectId === null) {
            return $this->error('failed');
        }

        $this->ProjectAccess->add($projectId, $user->id, true);
        if ($clientId != $user->id) {
            $this->ProjectAccess->add($projectId, $clientId, false);
        }

        return ['id' => $projectId];
    }

    public function createDesign($data)
    {
        if (empty($data['project_id'])) {
            return $this->error('missedArguments');
        }

        if (!$this->isEditable($data['project_id'])) {
            return $this->error('notEditable');
        }

        $result = $this->Design->create($data);
        if ($result !== null) {
            return ['id' => $result];
        }

        return $this->error('failed');
    }

    public function createArea($data)
    {
        if (empty($data['design_id'])) {
            return $this->error('missedArguments');
        }

        $design = $this->Design->get($data['design_id']);
        if ($design === null) {
            return $this->error('missedArguments');
        }

        if (!$this->isEditable($design->project_id)) {
            return $this->error('notEditable');
        }

        $user = auth()->user();
        if ($user === null) {
            return $this->error('loginError');
        }

        $result = $this->DesignArea->create($user->id, $data);
        if ($result !== null) {
            return ['id' => $result];
        }

        return $this->error('failed');
    }

    public function updateProject($data)
    {
        if (empty($data['id'])) {
            return $this->error('missedArguments');
        }

        if (!$this->isEditable($data['id'])) {
            return $this->error('notEditable');
        }

        if ($this->Project->update($data['id'], $data)) {
            return true;
        }

        return $this->error('failed');
    }

    public function updateDesign($data)
    {
        if (empty($data['id'])) {
            return $this->error('missedArguments');
        }

        $design = $this->Design->get($data['id']);
        if ($design === null) {
            return $this->error('missedArguments');
        }

        if (!$this->isEditable($design->project_id)) {
            return $this->error('notEditable');
        }

        if ($this->Design->update($design->id, $data)) {
            return true;
        }

        return $this->error('failed');
    }

    public function updateArea($data)
    {
        if (empty($data['id'])) {
            return $this->error('missedArguments');
        }

        $projectId = $this->DesignArea->projectId($data['id']);
        if ($projectId === null) {
            return $this->error('missedArguments');
        }

        $user = auth()->user();
        if ($user === null) {
            return $this->error('loginError');
        }

        if (!$this->isEditable($projectId)) {
            return $this->error('notEditable');
        }

        if ($this->DesignArea->isLocked($data['id'], $user->id)) {
            return $this->error('locked');
        }

        if ($this->DesignArea->update($data['id'], $user->id, $data)) {
            return true;
        }

        return $this->error('failed');
    }

    public function deleteProject($id)
    {
        $user = auth()->user();
        if ($user === null) {
            return $this->error('loginError');
        }

        if (!$this->isEditable($id) ||
            !$this->Project->isOwner($user->id, $id)
        ) {
            return $this->error('notEditable');
        }

        if ($this->Project->delete($id)) {
            return true;
        }

        return $this->error('failed');
    }

    public function deleteDesign($id)
    {
        $design = $this->Design->get($id);
        if ($design === null) {
            return $this->error('missedArguments');
        }

        $user = auth()->user();
        if ($user === null) {
            return $this->error('loginError');
        }

        if (!$this->isEditable($design->project_id) ||
            !$this->Project->isOwner($user->id, $design->project_id)
        ) {
            return $this->error('notEditable');
        }

        if ($this->Design->delete($design->id)) {
            return true;
        }

        return $this->error('failed');
    }

    public function deleteArea($id)
    {
        $projectId = $this->DesignArea->projectId($id);
        if ($projectId === null) {
            return $this->error('missedArguments');
        }

        $user = auth()->user();
        if ($user === null) {
            return $this->error('loginError');
        }

        if (!$this->isEditable($projectId) ||
            !$this->Project->isOwner($user->id, $projectId)
        ) {
            return $this->error('notEditable');
        }

        if ($this->DesignArea->isLocked($id, $user->id)) {
            return $this->error('locked');
        }

        if ($this->DesignArea->delete($id)) {
            return true;
        }

        return $this->error('failed');
    }

    private function prepareProjectData($data, $userProjects)
    {
        $result = [];

        if ($data === null) {
            return $result;
        }

        $data = $data->toArray();

        // Create list of users
        $userIds = $this->fieldIdList($data, ['owner_id', 'original_owner_id']);
        $userInfo = $this->userInfo($userIds);

        foreach ($data as $idx => $value) {
            if (empty($value['id']) || !isset($userProjects[$value['id']])) {
                continue;
            }

            $result[$idx] = $value;

            $result[$idx]['is_editable']  = (bool) $userProjects[ $value['id'] ];
            $result[$idx]['client_name']  = '';
            $result[$idx]['client_email'] = '';
            $result[$idx]['owner_name']   = '';
            $result[$idx]['date']         = date('d/m/Y G:i', strtotime($value['created']));

            if (!empty($value['original_owner_id']) && isset($userInfo[ $value['original_owner_id'] ])) {
                $result[$idx]['client_name'] = $userInfo[ $value['original_owner_id'] ]['name'];
                $result[$idx]['client_email'] = $userInfo[ $value['original_owner_id'] ]['email'];
            }

            if (!empty($value['owner_id']) && isset($userInfo[ $value['owner_id'] ])) {
                $result[$idx]['owner_name'] = $userInfo[ $value['owner_id'] ]['name'];
            }
        }

        return $result;
    }

    private function prepareDesignData($data, $userProjects)
    {
        $result = [];

        if ($data === null) {
            return $result;
        }

        $data = $data->toArray();

        // Create list of users
        $userIds = [];
        foreach ($data as $idx => $value) {
            $userIds = $this->fieldIdList($value['design_area'], ['last_modified_by_id'], array_flip($userIds));
        }
        $userInfo = $this->userInfo($userIds);

        foreach ($data as $idx => $value) {
            if (empty($value['project_id']) || !isset($userProjects[$value['project_id']])) {
                continue;
            }

            $result[$idx] = $value;

            foreach ($value['design_area'] as $areaIdx => $area) {
                $area['project_id'] = $value['project_id'];
                $area['last_modified_by'] = '';

                if (!empty($area['last_modified_by_id']) && isset($userInfo[ $area['last_modified_by_id'] ])) {
                    $area['last_modified_by'] = $userInfo[ $area['last_modified_by_id'] ]['name'];
                }

                //unset($area['last_modified_by_id']);
                $result[$idx]['areas'][] = $area;
            }

            unset($result[$idx]['design_area']);
        }

        return $result;
    }

    private function prepareAreaData($data, $userProjects)
    {
        $result = [];

        if ($data === null) {
            return $result;
        }

        $data = $data->toArray();

        // Create list of users
        $userIds = $this->fieldIdList($data, ['locked_by', 'last_modified_by_id']);
        $userInfo = $this->userInfo($userIds);

        $designIds = $this->fieldIdList($data, ['design_id']);
        $projectIds = $this->Design->getProjectIds($designIds);

        foreach ($data as $idx => $value) {
            $areaProjectId = null;
            foreach ($projectIds as $projectId => $designs) {
                if (in_array($value['design_id'], $designs)) {
                    $areaProjectId = $projectId;
                    break;
                }
            }

            if ($areaProjectId === null || !isset($userProjects[$areaProjectId])) {
                continue;
            }

            $result[$idx] = $value;

            $result[$idx]['project_id']       = $areaProjectId;
            $result[$idx]['is_editable']      = (bool) $userProjects[$areaProjectId];
            $result[$idx]['locked_by']        = '';
            $result[$idx]['last_modified_by'] = '';
            $result[$idx]['lock_expire_date'] = ((strtotime($value['lock_expire']) - time()) > 0) ? $value['lock_expire'] : null;

            if (!empty($value['locked_by']) && isset($userInfo[ $value['locked_by'] ])) {
                $result[$idx]['locked_by'] = $userInfo[ $value['locked_by'] ]['name'];
            }

            if (!empty($value['last_modified_by_id']) && isset($userInfo[ $value['last_modified_by_id'] ])) {
                $result[$idx]['last_modified_by'] = $userInfo[ $value['last_modified_by_id'] ]['name'];
            }

            unset($result[$idx]['lock_expire']);
            //unset($result[$idx]['last_modified_by_id']);
        }

        return $result;
    }

    private function fieldIdList(array $data, array $fields = [], array $result = [])
    {
        //$result = [];

        foreach ($data as $value) {
            foreach ($fields as $field) {
                if (isset($value[$field]) && !empty($value[$field])) {
                    $result[ $value[$field] ] = true;
                }
            }
        }

        return array_keys($result);
    }

    private function userInfo(array $id = [])
    {
        return $this->User->info($id);
    }

    private function isEditable($projectId)
    {
        $userProjects = $this->userProjects();

        return isset($userProjects[$projectId]) ? (bool) $userProjects[$projectId] : false;
    }

    private function error($error = '')
    {
        if (!isset($this->errors[$error])) {
            return ['Error' => $this->errors['unknown']];
        }

        return ['Error' => $this->errors[$error]];
    }

    public function getSharedProject()
    {
        $user = auth()->user();
        if ($user === null) {
            return $this->error('loginError');
        }

        return $this->Project->shared($user->id);
    }

    public function isOwner($projectId)
    {
        $user = auth()->user();
        if ($user === null) {
            return false;
        }

        return $this->Project->isOwner($user->id, $projectId);
    }

    public function getUserIdByEmail($email, $create = true) {
        $userId = $this->User->getIdByEmail($email);

        if ($create && $userId === null) {
            $userId = $this->User->create($email);
        }

        return $userId;
    }
    
    public function saveExportedImage(array $data = [])
    {
        if (!isset($data['data'])) {
            return '';
        }
        
        return $this->ExportImage->add($data['data']);
    }
}