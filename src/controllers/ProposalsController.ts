import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Proposals from '@models/Proposal';
import Users from '@models/Users';

class ProposalsController {
  async index(req: Request, res: Response) {
    const proposalsRepository = getRepository(Proposals);

    const allTenders = await proposalsRepository.find({
      where: [
        { id_provider: req.params.id },
        { id_contractor: req.params.id },
      ],
    });

    return res.json(allTenders);
  }

  async store(req: Request, res: Response) {
    const proposalsRepository = getRepository(Proposals);
    const usersRepository = getRepository(Users);

    const { id_provider, id_contractor, tcoin } = req.body;

    const existUserProvider = await usersRepository.findOne({ where: { id: id_provider } });

    const existUserContractor = await usersRepository.findOne({ where: { id: id_contractor } });

    if (!existUserProvider && !existUserContractor) {
      return res.status(409).json({ error: 'Provider or contractor not exist' });
    }

    const tender = proposalsRepository.create({ id_provider, id_contractor, tcoin });

    await proposalsRepository.save(tender);

    return res.json(tender);
  }
}

export default new ProposalsController();
