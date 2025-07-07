import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { CardService } from './card.service';
import { GetUser } from '../auth/decorator';
import { CardDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CardFilterDto } from './dto/cardFilterDto';

@UseGuards(JwtGuard)
@Controller('card')
export class CardController {
  constructor(private cardService: CardService) {}

  @Post('getAllCards')
  getAllCards(
    @GetUser('id') userId: number,
    @Body() filterDto: CardFilterDto,
  ) {
    return this.cardService.getAllCards(userId, filterDto);
  }

  @Get('listId/:id')
  getCardsByListId(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) listId: number,
  ) {
    return this.cardService.getCardsByListId(userId, listId);
  }

  @Post('listId/:id')
  @UseInterceptors(FileInterceptor('file'))
  createList(
    @Body() dto: CardDto,
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) listId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.cardService.createList(userId, listId, dto, file?.buffer);
  }

  @Patch('cardId/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateList(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) cartId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CardDto,
  ) {
    return this.cardService.updateList(userId, cartId, dto, file?.buffer);
  }

  @Delete('cardId/:cardId')
  deleteCardById(
    @GetUser('id') userId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
  ) {
    return this.cardService.deleteCardById(userId, cardId);
  }
}
