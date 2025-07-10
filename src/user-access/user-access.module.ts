import { Module } from '@nestjs/common';
import { UserAccessController } from './user-access.controller';
import { UserAccessService } from './user-access.service';
import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [UserAccessController],
  providers: [UserAccessService],
  exports: [UserAccessService],
  imports: [MailModule],
})
export class UserAccessModule {}
