// src/mail/mail.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 465,
      secure: true,
      auth: {
        user: 'im_mail@mail.ru',
        pass: 'im_password_or_app_password',
      },
    });
  }

  async sendBoardAccessEmail(to: string) {
    return this.transporter.sendMail({
      from: '"Board Access" <your_mail@mail.ru>',
      to,
      subject: 'Board',
      text: 'Du arden unes nor board',
    });
  }
}
