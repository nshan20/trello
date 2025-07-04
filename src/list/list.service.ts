import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListDto } from './dto';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}

  async getListByBoardId(userId: number, boardId: number) {
    return this.prisma.list.findMany({
      where: {
        userId,
        boardId,
      },
    });
  }

  async createList(userId: number, boardId: number, dto: ListDto) {
    const board = await this.prisma.board.findFirst({
      where: {
        id: boardId,
        userId,
      },
    });

    if (!board) {
      throw new NotFoundException('No board');
    }

    return this.prisma.list.create({
      data: {
        userId,
        boardId,
        ...dto,
      },
    });
  }

  async updateList(userId: number, listId: number, dto: ListDto) {
    const list = await this.prisma.list.findUnique({
      where: {
        id: listId,
      },
    });

    // @ts-ignore
    if (!listId || list.userId !== userId)
      throw new ForbiddenException(`board with id ${listId} not found`);

    return this.prisma.list.update({
      where: {
        id: listId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteListById(userId: number, listId: number) {
    const list = await this.prisma.list.findUnique({
      where: {
        id: listId,
      },
    });

    // @ts-ignore
    if (!listId || list.userId !== userId)
      throw new ForbiddenException(`Bookmark with id ${listId} not found`);

    await this.prisma.list.delete({
      where: {
        id: listId,
      },
    });
  }
}
