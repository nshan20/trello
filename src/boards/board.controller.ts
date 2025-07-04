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
import { BoardDto } from './dto';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BoardService } from './board.service';

@UseGuards(JwtGuard)
@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}


  @Get()
  getBoards(@GetUser('id') userId: number) {
    return this.boardService.getBoards(userId);
  }

  @Get(':id')
  getBoardById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) boardId: number,
  ) {
    return this.boardService.getBoardById(userId, boardId);
  }

  @Post()
  createBoard(@Body() dto: BoardDto, @GetUser('id') userId: number) {
    return this.boardService.createBoard(dto, userId);
  }

  @Patch(':id')
  updateBoard(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) boardId: number,
    @Body() dto: BoardDto,
  ) {
    return this.boardService.updateBoard(dto, boardId, userId);
  }

  @Delete(':id')
  deleteBoardById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) boardId: number,
  ) {
    return this.boardService.deleteBoardById(userId, boardId);
  }
}
