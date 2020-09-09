import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Tenders from '@models/Tenders';
import Users from '@models/Users';

class TendersController {
  async index(req: Request, res: Response) {
    const tendersRepository = getRepository(Tenders);

    // const allUsers = await repository.find();

    // return res.json(allUsers);
  }

  async store(req: Request, res: Response) {
    const tendersRepository = getRepository(Tenders);
    const usersRepository = getRepository(Users);

    const { id_provider, id_contractor, tcoin } = req.body;

    const existUserProvider = await usersRepository.findOne({ where: { id: id_provider } });

    const existUserContractor = await usersRepository.findOne({ where: { id: id_contractor } });

    if (!existUserProvider && !existUserContractor) {
      return res.status(409).json({ error: 'Provider or contractor not exist' });
    }

    const tender = tendersRepository.create({ id_provider, id_contractor, tcoin });

    await tendersRepository.save(tender);

    return res.json(tender);
  }
}

export default new TendersController();
