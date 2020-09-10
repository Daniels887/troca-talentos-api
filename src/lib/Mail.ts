import nodemailer from 'nodemailer';
import exphbs from 'express-handlebars';
import hbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';
import mailConfig from '../config/mail';

interface IAddress {
  address: string;
  name: string;
}

interface IMessage{
  to: IAddress;
  from: IAddress;
  subject: string;
  context: any,
  template: string
}

class Mail {
  sendMail(message: IMessage) {
    const transporter = nodemailer.createTransport(mailConfig);

    const viewPath = resolve(__dirname, '..', 'views', 'emails');

    transporter.use(
      'compile',
      hbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      }),
    );

    transporter.sendMail({ ...message });
  }
}

export default new Mail();
