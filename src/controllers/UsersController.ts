import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Users from '@models/Users';
import Mail from '../lib/Mail';

class UsersController {
  async index(req: Request, res: Response) {
    const repository = getRepository(Users);

    const allUsers = await repository.find();

    return res.json(allUsers);
  }

  async store(req: Request, res: Response) {
    const repository = getRepository(Users);

    const {
      username, email, password, age,
    } = req.body;

    const userExists = await repository.findOne({ where: [{ email }, { username }] });

    if (userExists) {
      return res.status(409).json({ error: 'Username or email already in use' });
    }

    const user = repository.create({
      username, email, password, age, tcoin: 5, avatar: '',
    });

    await repository.save(user);

    return res.json(user);
  }

  async passwordRecovery(req: Request, res: Response) {
    const repository = getRepository(Users);

    const user = await repository.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(409).json({ error: 'User not exists' });
    }

    const randomPassword = Math.random().toString(36).slice(-8);

    user.password = randomPassword;

    await repository.save(user);

    await Mail.sendMail({
      to: {
        name: user?.username || '',
        address: user?.email || '',
      },
      from: {
        name: 'Equipe Troca Talentos',
        address: 'equipe@trocatalentos.com.br',
      },
      subject: 'Recuperação de senha - Troca Talentos',
      template: 'recovery',
      context: {
        username: user.username,
        password: randomPassword,
      },
    });

    return res.json({ message: 'E-mail enviado com sucesso!' });
  }

  async update(req: Request, res: Response) {
    const repository = getRepository(Users);

    const {
      username, email, password, age,
    } = req.body;

    const user = await repository.findOne({ where: { id: req.params.id } });

    if (!user) {
      return res.status(409).json({ error: 'User not exists' });
    }
    if (req.file) {
      const { filename: path } = req.file;
      user.avatar = path;
    }

    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email;
    }

    if (password) {
      user.password = password;
    }

    if (age) {
      user.age = parseInt(age, 10);
    }

    await repository.save(user);

    return res.json(user);
  }
}

export default new UsersController();
