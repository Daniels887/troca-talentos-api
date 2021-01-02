import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Proposals from '@models/Proposal';
import Users from '@models/Users';
import Schedules from '@models/Schedules';

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

    const {
      id_provider, id_contractor, tcoin, date,
    } = req.body;

    const existUserProvider = await usersRepository.findOne({ where: { id: id_provider } });

    const existUserContractor = await usersRepository.findOne({ where: { id: id_contractor } });

    if (!existUserProvider && !existUserContractor) {
      return res.status(409).json({ error: 'Provider or contractor not exist' });
    }

    const tender = proposalsRepository.create({
      id_provider, id_contractor, tcoin, date, accepted: '',
    });

    await proposalsRepository.save(tender);

    return res.json(tender);
  }

  async acceptProposal(req: Request, res: Response) {
    const proposalsRepository = getRepository(Proposals);
    const scheduleRepository = getRepository(Schedules);

    const proposal = await proposalsRepository.findOne({
      where: {
        id_provider: req.params.id_provider,
      },
    });

    if (!proposal) {
      return res.status(409).json({ error: 'User is not a provider' });
    }

    const { accepted } = req.body;

    proposal.accepted = accepted;

    await proposalsRepository.save(proposal);

    if (accepted) {
      const schedule = scheduleRepository.create({
        id_contractor: proposal.id_contractor,
        id_provider: proposal.id_provider,
        date: proposal.date,
      });

      await scheduleRepository.save(schedule);
    }

    return res.json(proposal);
  }
}

export default new ProposalsController();
