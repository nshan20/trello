import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';

@Module({
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}
