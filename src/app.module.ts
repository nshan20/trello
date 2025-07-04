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
import { UserAccessService } from './user-access/user-access.service';
import { UserAccessModule } from './user-access/user-access.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PrismaModule,
    AuthModule,
    BoardModule,
    ListModule,
    CardModule,
    UserAccessModule,
  ],
  controllers: [CardController],
  providers: [CardService, UserAccessService],
})
export class AppModule {}
