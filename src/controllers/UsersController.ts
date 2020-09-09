import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import User from '@models/Users';

class UsersController {
  async index(req: Request, res: Response) {
    const repository = getRepository(User);

    const allUsers = await repository.find();

    return res.json(allUsers);
  }

  async store(req: Request, res: Response) {
    const repository = getRepository(User);

    const { email, password } = req.body;

    const userExists = await repository.findOne({ where: { email } });

    if (userExists) {
      return res.sendStatus(409);
    }

    const user = repository.create({ email, password, tcoin: 5 });

    await repository.save(user);

    return res.json(user);
  }
}

export default new UsersController();
