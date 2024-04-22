import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(email: string, subject: string, body: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        html: body,
      });
      console.log('Email sent successfully.');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
