import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { format, parseISO, compareAsc } from 'date-fns';

import Schedules from '@models/Schedules';

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
}

export default new SchedulesController();
