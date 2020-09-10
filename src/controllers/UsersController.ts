import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '@models/Users';
import Mail from 'src/lib/Mail';

class UsersController {
  async index(req: Request, res: Response) {
    const repository = getRepository(User);

    const allUsers = await repository.find();

    return res.json(allUsers);
  }

  async store(req: Request, res: Response) {
    const repository = getRepository(User);

    const { email, password } = req.body;

    const userExists = await repository.findOne({ where: { email } });

    if (userExists) {
      return res.sendStatus(409);
    }

    const user = repository.create({
      email, password, tcoin: 5, avatar: '',
    });

    console.log(user);

    await repository.save(user);

    return res.json(user);
  }

  async passwordRecovery(req: Request, res: Response) {
    const repository = getRepository(User);

    const user = await repository.findOne({ where: { id: req.body.id } });

    if (!user) {
      return res.status(409).json({ error: 'User not exists' });
    }

    const randomPassword = Math.random().toString(36).slice(-8);

    user.password = randomPassword;

    await repository.save(user);

    await Mail.sendMail({
      to: {
        name: user?.email || '',
        address: user?.email || '',
      },
      from: {
        name: 'Equipe Troca Talentos',
        address: 'equipe@trocatalentos.com.br',
      },
      subject: 'Recuperação de senha - Troca Talentos',
      body: `<p>Sua nova senha é: ${randomPassword} não esqueça de altera-lá </p><br/>Equipe Troca Talentos`,
    });

    return res.json({ message: 'E-mail enviado com sucesso!' });
  }
}

export default new UsersController();
