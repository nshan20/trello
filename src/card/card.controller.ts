import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { CardService } from './card.service';
import { GetUser } from '../auth/decorator';
import { CardDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtGuard)
@Controller('card')
export class CardController {
  constructor(private cardService: CardService) {}

  @Get('listId/:id')
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
  @UseInterceptors(FileInterceptor('file')) // ✅ ԱՆՀՐԱԺԵՇՏ է ֆայլ ստանալու համար
  updateList(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) cartId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CardDto,
  ) {
    console.log(file?.buffer);
    return this.cardService.updateList(userId, cartId, dto, file?.buffer);
  }

  @Delete('cardId/:cardId')
  deleteCardById(
    @GetUser('id') userId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
  ) {
    return this.cardService.deleteCardById(userId, cardId);
  }

  // Controller-ում
  @Post('upload-image/:cardId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('cardId', ParseIntPipe) cardId: number,
    @UploadedFile() file: any, // կամ file: { buffer: Buffer }
  ) {
    console.log(file?.buffer);
    return this.cardService.addImageToCard(cardId, file.buffer);
  }

}
