import { Router } from 'express';
import {
  deleteProjectById,
  createProject,
  getProjects,
  getProjectById,
  updateWidgetsFromProject,
  updateProjectById,
  getWidgetsFromProject,
  addMemberToProject,
  removeMemberFromProject,
  updateMemberFromProject,
  getMembersFromProject,
} from '../controller/project.controller';

export const projectRouter = Router({ mergeParams: true });

// Todo: do we need -> get All Projects from User 'abc'? --> if so pls update readme too
// GET All Projects
projectRouter.get('/', getProjects);
// GET Project by ID
projectRouter.get('/:projectId', getProjectById);
// GET Widgets of Project by ID of Project
projectRouter.get(':projectId/widgets', getWidgetsFromProject);
// UPDATE Widget from Project by IDs
projectRouter.put('/:projectId/widgets', updateWidgetsFromProject);
// POST Create new Project
projectRouter.post('/', createProject);
// DELETE Project by ID
projectRouter.delete('/:projectId', deleteProjectById);
// UPDATE Project by ID
projectRouter.patch('/:projectId', updateProjectById);

projectRouter.post('/:projectId/members', addMemberToProject);

projectRouter.delete('/:projectId/members/:userId', removeMemberFromProject);

projectRouter.patch('/:projectId/members/:userId', updateMemberFromProject);

projectRouter.get('/:projectId/members', getMembersFromProject);