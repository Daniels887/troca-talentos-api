import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '@models/Users';

class SessionController {
  async store(req: Request, res: Response) {
    const repository = getRepository(User);

    const { email, password } = req.body;

    const user = await repository.findOne({ where: { email } });

    if (!user) {
      return res.sendStatus(401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.sendStatus(401);
    }

    // trocar esse secret, para um atributo no meu .env
    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1d' });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        hours: user.hours,
      },
      token,
    });
  }
}

export default new SessionController();
