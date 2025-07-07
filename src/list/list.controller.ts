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
import { ListService } from './list.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { ListDto } from './dto';
import { CardService } from '../card/card.service';

@UseGuards(JwtGuard)
@Controller('list')
export class ListController {
  constructor(
    private listService: ListService,
  ) {}

  @Get('boardId/:id')
  async getListsByBoardId(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) boardId: number,
  ) {
    return this.listService.getListsWithCards(userId, boardId);
  }

  @Post('boardId/:id')
  createList(
    @Body() dto: ListDto,
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) boardId: number,
  ) {
    return this.listService.createList(userId, boardId, dto);
  }

  @Patch(':id')
  updateList(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) listId: number,
    @Body() dto: ListDto,
  ) {
    return this.listService.updateList(userId, listId, dto);
  }

  @Delete(':id')
  deleteListById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) listId: number,
  ) {
    return this.listService.deleteListById(userId, listId);
  }
}
