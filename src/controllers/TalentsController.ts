import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Talents from '@models/Talents';
import Users from '@models/Users';

class TalentsController {
  async store(req: Request, res: Response) {
    const talentsRepository = getRepository(Talents);
    const usersRepository = getRepository(Users);
    let banner = '';

    const {
      userId, talent, description, tcoin,
    } = req.body;

    const userExist = await usersRepository.findOne({ where: { id: userId } });

    if (!userExist) {
      return res.status(409).json({ error: 'User not exists' });
    }

    if (req.file) {
      const { filename: path } = req.file;
      banner = path;
    }

    const talentExist = await talentsRepository.findOne({ where: { user: userId, talent } });

    if (talentExist) {
      return res.status(409).json({ error: 'Talent already exist' });
    }

    const newTalent = talentsRepository.create({
      user: userId, talent, description, rating: 0, banner, tcoin: parseInt(tcoin, 10),
    });

    await talentsRepository.save(newTalent);

    return res.json(newTalent);
  }

  async showUsersByTalent(req: Request, res: Response) {
    const talentRepository = getRepository(Talents);

    const allUsersFilteredByTalent = await talentRepository.find({
      where:
      { talent: req.params.title },
    });

    return res.json(allUsersFilteredByTalent);
  }

  async update(req: Request, res: Response) {
    const talentsRepository = getRepository(Talents);

    const currentTalent = await talentsRepository.findOne({ where: { id: req.params.id } });

    if (!currentTalent) {
      return res.status(409).json({ error: 'Talent not exists' });
    }

    if (req.file) {
      const { filename: path } = req.file;
      currentTalent.banner = path;
    }

    const {
      talent, description, rating, tcoin,
    } = req.body;

    const ratingMean = currentTalent.rating === 0 ? rating
      : (currentTalent.rating + parseInt(rating, 10)) / 2;

    currentTalent.talent = talent;
    currentTalent.description = description;
    currentTalent.tcoin = tcoin;
    currentTalent.rating = Math.round(ratingMean);

    await talentsRepository.save(currentTalent);

    return res.json(currentTalent);
  }
}

export default new TalentsController();
