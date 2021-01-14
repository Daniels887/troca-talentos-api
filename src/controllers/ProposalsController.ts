import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Proposals from '@models/Proposal';
import Schedules from '@models/Schedules';
import Talents from '@models/Talents';
import User from '@models/Users';

import { compareAsc, format } from 'date-fns';
import { parseISO } from 'date-fns/fp';

class ProposalsController {
  async index(req: Request, res: Response) {
    const proposalsRepository = getRepository(Proposals);

    const allProposals = await proposalsRepository.createQueryBuilder('proposals')
      .innerJoinAndMapMany('proposals.users_data', User, 'user', 'proposals.id_contractor = user.id OR proposals.id_provider = user.id')
      .where('proposals.id_contractor = :id_contractor OR proposals.id_provider = :id_provider', { id_provider: req.params.id, id_contractor: req.params.id })
      .getMany();

    return res.json(allProposals);
  }

  async store(req: Request, res: Response) {
    const proposalsRepository = getRepository(Proposals);
    const scheduleRepository = getRepository(Schedules);
    const userRepository = getRepository(User);

    const {
      id_provider, id_contractor, tcoin, date, talentId,
    } = req.body;

    const providerScheduleExist = await scheduleRepository.findOne({
      where: [{ id_provider, date, finish: false },
        { id_provider: id_contractor, date, finish: false }],
    });

    const contractorScheduleExist = await scheduleRepository.findOne({
      where: [{ id_contractor, date, finish: false },
        { id_contractor: id_provider, date, finish: false }],
    });

    const contractorUser = await userRepository.findOne({
      where: {
        id: id_contractor,
      },
    });

    const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    const compareDates = compareAsc(parseISO(date), parseISO(currentDate));

    if (contractorUser.tcoin < 0) {
      return res.status(409).json({ error: 'Do you not have tcoins' });
    }

    if (compareDates === -1) {
      return res.status(400).json({ error: 'Date entered is less than the current' });
    }

    if (providerScheduleExist || contractorScheduleExist) {
      return res.status(409).json({ error: 'Provider or contractor is not available' });
    }

    const proposal = proposalsRepository.create({
      id_provider, id_contractor, tcoin, date, accepted: '', talentId,
    });

    await proposalsRepository.save(proposal);

    return res.json(proposal);
  }

  async acceptProposal(req: Request, res: Response) {
    const proposalsRepository = getRepository(Proposals);
    const scheduleRepository = getRepository(Schedules);
    const talentRepository = getRepository(Talents);

    const { accepted } = req.body;

    const proposal = await proposalsRepository.findOne({
      where: {
        id: req.params.id_proposal,
      },
    });

    if (!proposal) {
      return res.status(409).json({ error: 'User is not a provider' });
    }

    if (proposal.accepted === 'Y') {
      return res.status(409).json({ error: 'Proposal already accepted' });
    }

    if (accepted === 'N') {
      await proposalsRepository.delete(proposal);

      return res.json({ message: 'Proposal refused' });
    }

    proposal.accepted = accepted;

    await proposalsRepository.save(proposal);

    const { talentId } = proposal;

    const currentTalent = await talentRepository.findOne({
      where: {
        id: talentId,
      },
    });

    const schedule = scheduleRepository.create({
      id_contractor: proposal.id_contractor,
      id_provider: proposal.id_provider,
      date: proposal.date,
      talent: currentTalent,
      finish: false,
    });

    await scheduleRepository.save(schedule);

    return res.json(proposal);
  }
}

export default new ProposalsController();
