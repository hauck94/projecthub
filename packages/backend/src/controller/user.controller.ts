import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { Authentication } from '../middleware/authentication';

interface UserDTO {
  id: number;
  username: string;
  picture: string;
  status: string;
}

export const getUsers = async (_: Request, res: Response) => {
  const userRepository = getRepository(User);
  const users = await userRepository.find();

  const returnVal: UserDTO[] = [];
  for (const user of users) {
    returnVal.push({
      id: user.id,
      username: user.name,
      picture: user.picture,
      status: user.status,
    });
  }

  res.send({
    data: returnVal,
  });
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOneOrFail(userId);
    res.send({
      data: user,
    });
  } catch (e) {
    res.status(404).send({
      status: 'not_found',
    });
    res.send();
  }
};

export const registerNewUser = async (req: Request, res: Response) => {
  const { name, email, password, repeatPassword } = req.body;

  const userRepository = getRepository(User);

  const existingUser = await userRepository.findOne({
    where: {
      email,
    },
  });

  if (existingUser || password !== repeatPassword) {
    return res.status(400).send({
      status: 'bad_request',
    });
  }

  const hashedPass: string = await Authentication.hashPassword(password);

  const registeredUser = new User();
  registeredUser.name = name;
  registeredUser.email = email;
  registeredUser.status = '';
  registeredUser.picture = '';

  registeredUser.password = hashedPass;

  const createdUser = await userRepository.save(registeredUser);
  delete createdUser.password;

  return res.send({
    data: createdUser,
  });
};

export const deleteUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOneOrFail(userId);
    await userRepository.remove(user);
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

export const updateUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { name, email, password } = req.body;

  const userRepository = getRepository(User);
  try {
    let user = await userRepository.findOneOrFail(userId);
    user.name = name;
    user.email = email;
    user.password = password;

    user = await userRepository.save(user);

    res.send({
      data: user,
    });
  } catch (e) {
    res.status(404).send({
      status: 'not_found',
    });
    res.send();
  }
};

export const logInUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userRepository = getRepository(User);
  // Check if user exists
  const existingUser = await userRepository.findOne({
    where: {
      email,
    },
  });

  if (!existingUser) {
    return res.status(401).send({ status: 'unauthorized credentials' });
  }

  const rightPassword: boolean = await Authentication.comparePasswordWithHash(password, existingUser.password);

  if (rightPassword === false) {
    return res.status(401).send({ status: 'unauthorized credentials' });
  }

  const generatedToken: string = await Authentication.generateToken({
    email: existingUser.email,
    id: existingUser.id,
  });

  return res.send({
    data: generatedToken,
  });
};

/*
export const getProjectsFromUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try{
    const userRepository = getRepository(User);
    const projectsFromUser = await userRepository.findOneOrFail({ where: { id: userId}, relations: ['projects'] });

  res.status(200).send({
    data: res.json(projectsFromUser),
  });
  } catch (e) {
    res.status(404).send({
    status: 'not_found',
    });
  res.send();
  }
}*/
