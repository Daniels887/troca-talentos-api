import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Talents from '@models/Talents';
import Users from '@models/Users';

class TalentsController {
  async store(req: Request, res: Response) {
    const talentsRepository = getRepository(Talents);
    const usersRepository = getRepository(Users);

    const {
      userId, talent, description,
    } = req.body;

    const userExist = await usersRepository.findOne({ where: { id: userId } });

    if (!userExist) {
      return res.status(409).json({ error: 'User not exists' });
    }

    const talentExist = await talentsRepository.find({ where: { user: userId, talent } });

    if (talentExist.length) {
      return res.status(409).json({ error: 'Talent already exist' });
    }

    const newTalent = talentsRepository.create({
      user: userId, talent, description, rating: 0, banner: '',
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

    const currentTalent = await talentsRepository.find({ where: { id: req.params.id } });

    if (!currentTalent.length) {
      return res.status(409).json({ error: 'Talent not exists' });
    }

    if (req.file) {
      const { filename: path } = req.file;
      currentTalent[0].banner = path;
    }

    const { talent, description, rating } = req.body;

    const ratingMean = currentTalent[0].rating === 0 ? rating
      : (currentTalent[0].rating + parseInt(rating, 10)) / 2;

    currentTalent[0].talent = talent;
    currentTalent[0].description = description;
    currentTalent[0].rating = Math.round(ratingMean);

    await talentsRepository.save(currentTalent);

    return res.json(currentTalent);
  }
}

export default new TalentsController();
