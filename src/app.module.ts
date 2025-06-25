import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BoardModule } from './boards/board.module';
import { ListModule } from './list/list.module';
import { CardController } from './card/card.controller';
import { CardService } from './card/card.service';
import { CardModule } from './card/card.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PrismaModule,
    AuthModule,
    BoardModule,
    ListModule,
    CardModule,
  ],
  controllers: [CardController],
  providers: [CardService],
})
export class AppModule {}
