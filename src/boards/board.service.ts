import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BoardDto } from './dto';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async getBoards(userId: number) {
    return this.prisma.board.findMany({
      where: {
        userId,
      },
    });
  }

  async getBoardById(userId: number, boardId: number) {
    return this.prisma.board.findFirst({
      where: {
        id: boardId,
        userId,
      },
    });
  }

  async createBoard(dto: BoardDto, userId: number) {
    const boardValue = await this.prisma.board.create({
      data: {
        userId,
        ...dto,
      },
    });

    return boardValue;
  }

  async updateBoard(dto: BoardDto, boardId: number, userId: number) {
    const board = await this.prisma.board.findUnique({
      where: {
        id: boardId,
      },
    });

    // @ts-ignore
    if (!boardId || board.userId !== userId)
      throw new ForbiddenException(`board with id ${boardId} not found`);

    return this.prisma.board.update({
      where: {
        id: boardId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBoardById(userId: number, boardId: number) {
    const board = await this.prisma.board.findUnique({
      where: {
        id: boardId,
      },
    });

    // @ts-ignore
    if (!boardId || board.userId !== userId)
      throw new ForbiddenException(`Bookmark with id ${boardId} not found`);

    await this.prisma.board.delete({
      where: {
        id: boardId,
      },
    });
  }
}
