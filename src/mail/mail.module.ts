import { Module } from '@nestjs/common';
import { MailerModule} from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';


@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
          user: 'test@gmail.com',
          pass: 'test',
        },
      },
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}
