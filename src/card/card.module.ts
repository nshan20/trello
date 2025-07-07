import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { UserAccessModule } from '../user-access/user-access.module';

@Module({
  imports: [UserAccessModule],
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}
