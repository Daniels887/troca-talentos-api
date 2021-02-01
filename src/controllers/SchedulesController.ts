import { Request, Response } from 'express';
import { getRepository, MoreThanOrEqual } from 'typeorm';
import {
  format, parseISO, compareAsc,
} from 'date-fns';

import Schedules from '@models/Schedules';
import Proposals from '@models/Proposal';
import Talents from '@models/Talents';
import Users from '@models/Users';

class SchedulesController {
  async store(req: Request, res: Response) {
    const schedulesRepository = getRepository(Schedules);

    const { id_provider, id_contractor, date } = req.body;

    const newSchedule = schedulesRepository.create({ id_provider, id_contractor, date });

    const providerScheduleExist = await schedulesRepository.findOne({
      where: [{ id_provider, date }, { id_provider: id_contractor, date }],
    });

    const contractorSchedulesExist = await schedulesRepository.findOne({
      where: [{ id_contractor, date }, { id_contractor: id_provider, date }],
    });

    const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    const compareDates = compareAsc(parseISO(date), parseISO(currentDate));

    if (compareDates === -1) {
      return res.status(400).json({ error: 'Date entered is less than the current' });
    }

    if (providerScheduleExist || contractorSchedulesExist) {
      return res.status(409).json({ error: 'Provider or contractor is not available' });
    }

    await schedulesRepository.save(newSchedule);

    return res.json(newSchedule);
  }

  async show_by_id(req: Request, res: Response) {
    const schedulesRepository = getRepository(Schedules);

    const schedulesOfUser = await schedulesRepository.createQueryBuilder('schedules')
      .leftJoinAndSelect('schedules.talent', 'talent')
      .innerJoinAndMapMany('schedules.users_data', Users, 'user', 'schedules.id_contractor = user.id OR schedules.id_provider = user.id')
      .where('schedules.id_contractor = :id_contractor OR schedules.id_provider = :id_provider', { id_provider: req.params.id, id_contractor: req.params.id })
      .getMany();

    return res.json(schedulesOfUser);
  }

  async show_last(req: Request, res: Response) {
    const schedulesRepository = getRepository(Schedules);
    const proposalRepository = getRepository(Proposals);

    const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    const schedule = await schedulesRepository.findOne({
      where: {
        finish: false,
        id_contractor: req.params.id,
      },
    });

    let lastSchedule = null;

    if (schedule) {
      lastSchedule = await schedulesRepository.findOne({
        where: {
          finish: false,
          id_contractor: req.params.id,
          date: MoreThanOrEqual(schedule.date),
        },
        order: {
          id: 'DESC',
        },
        relations: ['talent'],
      });
    }

    const newProposals = await proposalRepository.find({
      where: {
        accepted: '',
        id_provider: req.params.id,
      },
    });

    const proposalsCanceled = await proposalRepository.createQueryBuilder('proposals')
      .innerJoinAndMapMany('proposals.talent', Talents, 'talents', 'proposals.talentId = talents.id')
      .where('(proposals.id_contractor = :id_contractor OR proposals.id_provider = :id_provider) AND proposals.accepted = :accepted', { accepted: 'C', id_contractor: req.params.id, id_provider: req.params.id })
      .getMany();

    const response = {
      proposals: newProposals,
      finished_schedule: lastSchedule,
      canceled: proposalsCanceled,
    };

    return res.json(response);
  }

  async finish(req: Request, res: Response) {
    const schedulesRepository = getRepository(Schedules);
    const talentsRepository = getRepository(Talents);
    const usersRepository = getRepository(Users);
    const proposalRepository = getRepository(Proposals);

    const schedule = await schedulesRepository.findOne({
      where: {
        id: req.params.id,
      },
      relations: ['talent'],
    });

    const talent = await talentsRepository.findOne({
      where: {
        id: schedule.talent.id,
      },
    });

    const { rating } = req.body;

    const ratingMean = talent.rating === 0 ? rating
      : (talent.rating + parseInt(rating, 10)) / 2;

    talent.rating = Math.round(ratingMean);

    await talentsRepository.save(talent);

    schedule.finish = true;

    await schedulesRepository.save(schedule);

    const user_contractor = await usersRepository.findOne({
      where: {
        id: schedule.id_contractor,
      },
    });

    const user_provider = await usersRepository.findOne({
      where: {
        id: schedule.id_provider,
      },
    });

    const proposal = await proposalRepository.findOne({
      where: {
        id_contractor: schedule.id_contractor,
        id_provider: schedule.id_provider,
        date: schedule.date,
      },
    });

    user_contractor.tcoin -= proposal.tcoin;
    user_provider.tcoin += proposal.tcoin;

    await usersRepository.save(user_contractor);
    await usersRepository.save(user_provider);

    return res.json({ tcoin: user_contractor.tcoin });
  }

  async delete(req: Request, res: Response) {
    const schedulesRepository = getRepository(Schedules);
    const proposalRepository = getRepository(Proposals);

    const schedule = await schedulesRepository.findOne({
      where: {
        id: req.params.id,
      },
    });

    const proposal = await proposalRepository.findOne({
      where: {
        id_contractor: schedule.id_contractor,
        id_provider: schedule.id_provider,
        date: schedule.date,
      },
    });

    proposal.accepted = 'C';

    await proposalRepository.save(proposal);

    await schedulesRepository.delete(schedule);

    return res.json({ message: 'Schedule deleted' });
  }
}

export default new SchedulesController();
