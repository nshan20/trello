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
import { UserAccessService } from './user-access.service';
import { GetUser } from '../auth/decorator';
import { ListDto } from '../list/dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtGuard)
@Controller('user-access')
export class UserAccessController {
  constructor(private userAccessService: UserAccessService) {}

  @Post('email/board/:id')
  async createAccessUserByEmail(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) boardId: number,
    @Body() dto: { email: string },
  ) {
    const user = await this.userAccessService.createAccessUserByEmail(
      dto.email,
      boardId,
      userId,
    );

    return user;
  }

  @Post('list/boardId/:boardId')
  createListGuest(
    @GetUser('id') userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() dto: ListDto,
  ) {
    return this.userAccessService.createListGuest(userId, boardId, dto);
  }

  @Patch('listId/:listId/boardId/:boardId/')
  updateListGuest(
    @GetUser('id') userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('listId', ParseIntPipe) listId: number,
    @Body() dto: ListDto,
  ) {
    return this.userAccessService.updateListGuest(userId, boardId, listId, dto);
  }

  @Get('lists/board-id/:id')
  async getBoardListsWithCards(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) boardId: number,
  ) {
    return this.userAccessService.getBoardListsWithCards(userId, boardId);
  }

  @Delete('lists/listId/:listId/boardId/:boardId')
  async deleteBoardListsWithCards(
    @GetUser('id') userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('listId', ParseIntPipe) listId: number,
  ) {
    return this.userAccessService.deleteBoardListsWithCards(
      userId,
      boardId,
      listId,
    );
  }

  @Get('boards')
  getBoardsByAccessUser(@GetUser('id') userId: number) {
    return this.userAccessService.getBoardsByAccessUser(userId);
  }

  @Post('card/boardId/:boardId/listId/:listId')
  @UseInterceptors(FileInterceptor('file'))
  async createCardGuest(
    @GetUser('id') userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('listId', ParseIntPipe) listId: number,
    @Body() dto: ListDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userAccessService.createCardGuest(
      userId,
      boardId,
      listId,
      dto,
      file?.buffer,
    );
  }

  @Patch('card/boardId/:boardId/cardId/:cardId')
  @UseInterceptors(FileInterceptor('file'))
  async updateCardGuest(
    @GetUser('id') userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() dto: ListDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userAccessService.updateCardGuest(
      userId,
      boardId,
      cardId,
      dto,
      file?.buffer,
    );
  }

  @Delete('card/cardId/:cardId/boardId/:boardId')
  async deleteCardGuest(
    @GetUser('id') userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
  ) {
    return this.userAccessService.deleteCardById(userId, cardId, boardId);
  }

  @Get('boardId/:boardId')
  async getBoardByAccessUser(
    @GetUser('id') userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.userAccessService.getBoardByAccessUser(userId, boardId);
  }
}
