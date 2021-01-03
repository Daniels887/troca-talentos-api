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

    const { accepted } = req.body;

    const proposal = await proposalsRepository.findOne({
      where: {
        id: req.params.id_proposal,
      },
    });

    if (!proposal) {
      return res.status(409).json({ error: 'User is not a provider' });
    }

    if (proposal.accepted && accepted) {
      return res.status(409).json({ error: 'Proposal already accepted' });
    }

    if (!proposal.accepted) {
      await proposalsRepository.delete(proposal);

      return res.json({ message: 'Proposal refused' });
    }

    proposal.accepted = accepted;

    await proposalsRepository.save(proposal);

    const schedule = scheduleRepository.create({
      id_contractor: proposal.id_contractor,
      id_provider: proposal.id_provider,
      date: proposal.date,
    });

    await scheduleRepository.save(schedule);

    return res.json(proposal);
  }
}

export default new ProposalsController();
