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

    const schedulesOfUser = await schedulesRepository.find({
      where: [{ id_provider: req.params.id },
        { id_contractor: req.params.id }],
      relations: ['talent'],
    });

    return res.json(schedulesOfUser);
  }

  async show_last(req: Request, res: Response) {
    const schedulesRepository = getRepository(Schedules);
    const proposalRepository = getRepository(Proposals);

    const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    const lastSchedule = await schedulesRepository.findOne({
      where: {
        finish: false,
        id_contractor: req.params.id,
        date: MoreThanOrEqual(currentDate),
      },
      order: {
        id: 'DESC',
      },
    });

    const newProposals = await proposalRepository.find({
      where: {
        accepted: '',
        id_provider: req.params.id,
      },
    });

    const response = {
      proposals: newProposals,
      finished_schedule: lastSchedule || {},
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

    return res.json({ success: true });
  }
}

export default new SchedulesController();
