import { Request, Response } from 'express';
import { EntityManager, getManager, getRepository } from 'typeorm';
import { Project } from '../entity/Project';
import { ProjectMember } from '../entity/ProjectMember';
import { User } from '../entity/User';
import { Widget } from '../entity/Widget';
import { Authentication } from '../middleware/authentication';

export interface WidgetDataDTO<T extends Object> {
  type: string; // the type is used to identify the widget type across the application
  id: string; // unique id of the the widget inside the widget-grid
  xPos: number; // x position on the widget-grid
  yPos: number; // y position on the widget-grid
  width: number; // width of the widget measured in grid columns
  height: number; // width of the widget measured in grid rows
  data: T; // custom widget data. This data can be further specified by the widget
}
export interface ProjectDTO {
  id: number;
  name: string;
  active: boolean;
  open: boolean;
  description?: string;
  labels?: string[];
  picture?: string;
  members: { id: number; permission: string; username: string; picture?: string; status?: string }[];
  widgets?: WidgetDataDTO<any>[];
}

export const getProjects = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const decodedToken = (await Authentication.verifyToken(token)) as any;

  const projectList = await getRepository(ProjectMember)
    .createQueryBuilder('pm')
    .where({ userId: Number(decodedToken.id) })
    .leftJoinAndSelect('pm.project', 'project')
    .getMany();

  const returnVal: ProjectDTO[] = [];
  for (const entry of projectList) {
    const project = entry.project;
    const members = await getRepository(ProjectMember)
      .createQueryBuilder('pm')
      .where({ projectId: project.id })
      .leftJoinAndSelect('pm.user', 'user')
      .select(['user.name', 'user.picture', 'user.status', 'pm.userId', 'pm.permission'])
      .getMany();

    returnVal.push({
      id: project.id,
      name: project.name,
      active: project.active,
      open: project.open,
      description: project.description,
      labels: JSON.parse(project.labels),
      picture: project.picture,
      members: members.map((member) => ({
        id: member.userId,
        username: member.user.name,
        picture: member.user.picture,
        permission: member.permission,
        status: member.user.status,
      })),
    });
  }

  res.send({
    data: returnVal,
  });
};

export const getProjectById = async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const projectRepository = getRepository(Project);
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const decodedToken = (await Authentication.verifyToken(token)) as any;

    const project = await projectRepository.findOneOrFail(projectId);

    const members = await getRepository(ProjectMember)
      .createQueryBuilder('pm')
      .where({ projectId: project.id, userId: decodedToken.id })
      .leftJoinAndSelect('pm.user', 'user')
      .select(['user.name', 'user.picture', 'user.status', 'pm.userId', 'pm.permission'])
      .getMany();

    if (members.length === 0) {
      res.status(404).send({
        status: 'not_found',
      });
    }

    const widgets = await getRepository(Widget).find({ project: project });

    res.send({
      data: {
        id: project.id,
        name: project.name,
        active: project.active,
        open: project.open,
        description: project.description,
        labels: project.labels,
        picture: project.picture,
        members: members.map((member) => ({
          id: member.userId,
          username: member.user.name,
          picture: member.user.picture,
          permission: member.permission,
          status: member.user.status,
        })),
        widgets: widgets.map((w) => ({
          type: w.type,
          id: w.id,
          xPos: w.xPos,
          yPos: w.yPos,
          width: w.width,
          height: w.height,
          data: JSON.parse(w.data),
        })),
      },
    });
  } catch (e) {
    res.status(404).send({
      status: 'not_found',
    });
    res.send();
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    return await getManager().transaction(async (manager: EntityManager) => {
      const {
        name,
        description,
        picture,
        members,
      }: {
        name: string;
        description: string;
        picture: string;
        members: { id: number; permission: string }[];
      } = req.body;

      if (!name) {
        return res.status(400).send({
          status: 'Malformed request',
        });
      }

      const project = new Project();
      project.name = name;
      project.active = true;

      project.description = description;
      project.picture = picture;
      const createdProject = await manager.getRepository(Project).save(project);

      if (members) {
        const userRepository = manager.getRepository(User);

        const asyncStack: Promise<any>[] = [];
        for (const member of members) {
          const user = await userRepository.findOne(member.id);
          if (user) {
            asyncStack.push(
              manager.getRepository(ProjectMember).save(new ProjectMember(createdProject, user, member.permission)),
            );
          } else {
            return res.status(400).send({
              status: 'Malformed request: user not found',
            });
          }
        }
        await Promise.all(asyncStack);
      }

      return res.send({
        data: createdProject,
      });
    });
  } catch (e) {
    console.log(e);

    return res.status(500).send({
      status: 'internal server error',
    });
  }
};

export const updateProjectById = async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);
  const { name, description, active, open, picture, backgroundColor, widgets } = req.body;

  const projectRepository = getRepository(Project);
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const decodedToken = (await Authentication.verifyToken(token)) as any;

    let project = await projectRepository.findOneOrFail({ id: projectId });

    const members = await getRepository(ProjectMember)
      .createQueryBuilder('pm')
      .where({ projectId: project.id, userId: decodedToken.id })
      .leftJoinAndSelect('pm.user', 'user')
      .select(['user.name', 'user.picture', 'user.status', 'pm.userId'])
      .getMany();

    const member = await getRepository(ProjectMember)
      .createQueryBuilder('pm')
      .where({ projectId: project.id, userId: decodedToken.id })
      .getOne();

    if (members.length === 0 || member.permission !== 'rw') {
      res.status(404).send({
        status: 'not_found',
      });
    }
    if (name) project.name = name;
    if (description) project.description = description;
    if (active !== undefined) project.active = active;
    if (open !== undefined) project.open = open;
    if (picture) project.picture = picture;
    if (backgroundColor) project.backgroundColor = backgroundColor;
    if (widgets) {
      await updateWidgets(project, widgets);
    }
    project = await projectRepository.save(project);
    res.send(204).send({
      status: 'Project successfully updated',
    });
  } catch (e) {
    res.status(404).send({
      status: 'not_found',
    });
    res.send();
  }
};

export const deleteProjectById = async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const projectRepository = getRepository(Project);
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const decodedToken = (await Authentication.verifyToken(token)) as any;

    const project = await projectRepository.findOneOrFail(projectId);

    const member = await getRepository(ProjectMember)
    .createQueryBuilder('pm')
    .where({ projectId: project.id, userId: decodedToken.id })
    .getOne();

    if (!member || member.permission !== 'rw') {
      res.status(404).send({
        status: 'not_found',
      });
    }

    // clean dependencies as atomic transaction
    await getManager().transaction(async () => {
      await getRepository(ProjectMember).delete({ projectId: project.id });
      const asyncStack: Promise<any>[] = [];
      for (const widget of project.widgets) {
        asyncStack.push(getRepository(Widget).delete({ id: widget.id }));
      }
      await Promise.all(asyncStack);
      await projectRepository.delete({ id: project.id });
    });

    res.send({
      status: 'erfolgreich',
    });
  } catch (e) {
    res.status(404).send({
      status: 'not_found',
    });
    res.send();
  }
};

export const getWidgetsFromProject = async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const projectRepository = getRepository(Project);

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const decodedToken = (await Authentication.verifyToken(token)) as any;

    const project = await projectRepository.findOneOrFail(projectId);

    const member = await getRepository(ProjectMember)
    .createQueryBuilder('pm')
    .where({ projectId: project.id, userId: decodedToken.id })
    .getOne();

    if (!member) {
      res.status(404).send({
        status: 'not_found',
      });
    }

    const widgetRepository = getRepository(Widget);
    const widgetsFromProject = await widgetRepository.findOneOrFail({
      where: { project: projectId },
    });
    res.status(200).send({
      data: res.json(widgetsFromProject),
      status: 'Successfully returned all widgets of project',
    });
  } catch (e) {
    res.status(404).send({
      status: 'Project or its widgets can not be found',
    });
  }
};

export const updateWidgetsFromProject = async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);
  const projectRepository = getRepository(Project);

  if (projectId) {
    const widgets = req.body as WidgetDataDTO<any>[];

    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      const decodedToken = (await Authentication.verifyToken(token)) as any;

      const project = await projectRepository.findOneOrFail({ where: { id: projectId } });
      const member = await getRepository(ProjectMember)
        .createQueryBuilder('pm')
        .where({ projectId: project.id, userId: decodedToken.id })
        .getOne();

      if (!member || member.permission !== 'rw') {
        res.status(404).send({
        status: 'not_found',
        });
      }

      await updateWidgets(project, widgets);

      res.status(200).send({
        status: 'erfolgreich',
      });
    } catch (e) {
      console.log(e);
      res.status(404).send({
        status: 'not_found',
      });
    }
    res.send();
  } else {
    res.send(400).send({
      status: 'missing query parameter "projectId"',
    });
  }
};

/*
// clean dependencies
await getManager().transaction(async () => {
  await getRepository(ProjectMember).delete({ projectId: project.id });
  let asyncStack: Promise<any>[] = [];
  for (const user of project.user) {
    asyncStack.push(getRepository(User).delete({ id: user.id }));
  }
  await Promise.all(asyncStack);
});
*/

export const addMemberToProject = async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);
  if (projectId) {
    const newMember = req.body as {
      userId: number;
      permission: string;
    };

    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      const decodedToken = (await Authentication.verifyToken(token)) as any;

      const project = await getRepository(Project).findOneOrFail({ id: projectId });

      const member = await getRepository(ProjectMember)
      .createQueryBuilder('pm')
      .where({ projectId: project.id, userId: decodedToken.id })
      .getOne();

      if (!member || member.permission !== 'rw') {
        res.status(404).send({
          status: 'not_found',
        });
      }

      const user = await getRepository(User).findOneOrFail({ id: newMember.userId });
      await getRepository(ProjectMember).save(new ProjectMember(project, user, newMember.permission));
      res.status(204).send();
    } catch (e) {
      res.status(404).send({
        status: 'not_found',
      });
    }
    res.send();
  } else {
    res.send(400).send({
      status: 'missing query parameter "projectId"',
    });
  }
};

export const removeMemberFromProject = async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);
  const userId = Number(req.params.userId);
  if (projectId && userId) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      const decodedToken = (await Authentication.verifyToken(token)) as any;

      const project = await getRepository(Project).findOneOrFail({ id: projectId });

      const member = await getRepository(ProjectMember)
      .createQueryBuilder('pm')
      .where({ projectId: project.id, userId: decodedToken.id })
      .getOne();

      if (!member || member.permission !== 'rw') {
        res.status(404).send({
          status: 'not_found',
        });
      }

      const user = await getRepository(User).findOneOrFail({ id: userId });
      const memberEntry = await getRepository(ProjectMember).findOneOrFail({ projectId: project.id, userId: user.id });
      await getRepository(ProjectMember).delete(memberEntry);
      res.status(204).send();
    } catch (e) {
      res.status(404).send({
        status: 'not_found',
      });
    }
    res.send();
  } else {
    res.send(400).send({
      status: 'missing query parameter "projectId"',
    });
  }
};


export const updateMemberFromProject = async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);
  const userId = Number(req.params.userId);
  const permission = req.body.permission;
  if (projectId && userId) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      const decodedToken = (await Authentication.verifyToken(token)) as any;

      const project = await getRepository(Project).findOneOrFail({ id: projectId });

      const member = await getRepository(ProjectMember)
      .createQueryBuilder('pm')
      .where({ projectId: project.id, userId: decodedToken.id })
      .getOne();

      if (!member || member.permission !== 'rw') {
        res.status(403).send({
          status: 'Forbidden. Not enough permissions!',
        });
      }

      if(permission !== 'rw' && permission !== 'ro'){
        res.status(404).send({
          status: 'not_found',
        });
      }

      const user = await getRepository(User).findOneOrFail({ id: userId });
      const memberEntry = await getRepository(ProjectMember).findOneOrFail({ projectId: project.id, userId: user.id });
      memberEntry.permission = permission;

      await getRepository(ProjectMember).save(memberEntry);
      res.status(204).send();
    } catch (e) {
      console.log(e);
      res.status(404).send({
        status: 'not_found',
      });
    }
    res.send();
  } else {
    res.send(400).send({
      status: 'missing query parameter "projectId"',
    });
  }
};

export const getMembersFromProject = async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const projectRepository = getRepository(Project);
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const decodedToken = (await Authentication.verifyToken(token)) as any;

    const project = await projectRepository.findOneOrFail(projectId);

    const member = await getRepository(ProjectMember)
      .createQueryBuilder('pm')
      .where({ projectId: project.id, userId: decodedToken.id })
      .getOne();

    if (!member) {
      res.status(404).send({
        status: 'not_found',
      });
    }

    const members = await getRepository(ProjectMember)
      .createQueryBuilder('pm')
      .where({ projectId: project.id })
      .getMany();

    res.send(members);
  } catch (e) {
    res.status(404).send({
      status: 'not_found',
    });
    res.send();
  }
};

const updateWidgets = async (project: Project, widgets: WidgetDataDTO<any>[]) => {
  try {
    if (project.widgets) {
      await getRepository(Widget).delete({ project: project });
    }

    for (const widget of widgets) {
      await getRepository(Widget).save(
        new Widget(
          widget.id,
          widget.type,
          project,
          widget.xPos,
          widget.yPos,
          widget.height,
          widget.width,
          JSON.stringify(widget.data),
        ),
      );
    }
    return true;
  } catch {
    return false;
  }
};


// const checkUserInProjectExist = (usersInProject: ProjectMember[], userID: number): boolean => {
//   let flag = false;
//   usersInProject.forEach((user) => {
//     if (user.id === userID) {
//       flag = true;
//     }
//   });
//   return flag ? true : false;
// };
