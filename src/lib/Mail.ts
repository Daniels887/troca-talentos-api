import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

interface IAddress {
  address: string;
  name: string;
}

interface IMessage{
  to: IAddress;
  from: IAddress;
  subject: string;
  body: string;
}

class Mail {
  sendMail(message: IMessage) {
    const transporter = nodemailer.createTransport(mailConfig);

    transporter.sendMail({
      to: {
        name: message.to.name,
        address: message.to.address,
      },
      from: {
        name: message.from.name,
        address: message.from.address,
      },
      subject: message.subject,
      html: message.body,
    });
  }
}

export default new Mail();
