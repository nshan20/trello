import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { CardModule } from '../card/card.module';

@Module({
  imports: [CardModule],
  providers: [ListService],
  controllers: [ListController],
})
export class ListModule {}
