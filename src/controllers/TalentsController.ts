import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Talents from '@models/Talents';
import Users from '@models/Users';

class TalentsController {
  async store(req: Request, res: Response) {
    const talentsRepository = getRepository(Talents);
    const usersRepository = getRepository(Users);

    const { userId, talent } = req.body;

    const userExist = await usersRepository.findOne({ where: { id: userId } });

    if (!userExist) {
      return res.status(409).json({ error: 'User not exists' });
    }

    const newTalent = talentsRepository.create({ user: userId, talent });

    await talentsRepository.save(newTalent);

    return res.json(newTalent);
  }
}

export default new TalentsController();
