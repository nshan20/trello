import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { CardService } from './card.service';
import { GetUser } from '../auth/decorator';
import { CardDto } from './dto';

@UseGuards(JwtGuard)
@Controller('card')
export class CardController {
  constructor(private cardService: CardService) {}

  @Get('list/:id')
  getCardsByListId(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) listId: number,
  ) {
    return this.cardService.getCardsByListId(userId, listId);
  }

  @Post('listId/:id')
  createList(
    @Body() dto: CardDto,
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) listId: number,
  ) {
    return this.cardService.createList(userId, listId, dto);
  }

  @Patch('cardId/:id')
  updateList(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) cartId: number,
    @Body() dto: CardDto,
  ) {
    return this.cardService.updateList(userId, cartId, dto);
  }

  @Delete('cardId/:id')
  deleteCardById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) cardId: number,
  ) {
    return this.cardService.deleteCardById(userId, cardId);
  }
}
