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

    if (req.params.title) {
      const allUsersFilteredByTalent = await talentRepository.createQueryBuilder('talents')
        .leftJoinAndSelect('talents.user', 'user')
        .where('LOWER(talents.talent) like LOWER(:talent) AND talents.user != :user_id', { talent: `%${req.params.title}%`, user_id: req.params.user_id })
        .getMany();
      return res.json(allUsersFilteredByTalent);
    }

    const allTalents = await talentRepository.createQueryBuilder('talents')
      .leftJoinAndSelect('talents.user', 'user')
      .where('talents.user != :user_id', { user_id: req.params.user_id })
      .orderBy('RANDOM()')
      .getMany();

    return res.json(allTalents);
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
      talent, description, tcoin,
    } = req.body;

    currentTalent.talent = talent;
    currentTalent.description = description;
    currentTalent.tcoin = parseInt(tcoin, 10);

    await talentsRepository.save(currentTalent);

    return res.json(currentTalent);
  }

  async show_by_id(req: Request, res: Response) {
    const talentsRepository = getRepository(Talents);

    const talent = await talentsRepository.findOne({
      where: {
        id: req.params.id,
      },
    });

    return res.json(talent);
  }

  async my_talents(req: Request, res: Response) {
    const talentsRepository = getRepository(Talents);

    const all_talents = await talentsRepository.find({
      where: {
        user: req.params.user_id,
      },
      relations: ['user'],
    });

    return res.json(all_talents);
  }
}

export default new TalentsController();
