import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListDto } from '../list/dto';
import { UserAccessDto } from './dto';
import { CardDto } from '../card/dto';

@Injectable()
export class UserAccessService {
  constructor(private prisma: PrismaService) {}

  async createAccessUserByEmail(
    email: string,
    boardId: number,
    userId: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return 'error user not found';
    }

    if (user.id === userId) {
      return 'error you can`t give yourself access';
    }

    const board = await this.prisma.board.findFirst({
      where: {
        userId,
        id: boardId,
      },
    });

    if (!board) {
      return 'error board not found';
    }

    return this.prisma.boardUserAccess.create({
      data: {
        userId: user.id,
        boardId: boardId,
        adminUserId: userId,
      },
    });
  }

  getDeadlineFlag(date: string | Date): 'red' | 'orange' | 'white' {
    const now = Date.now();
    const deadline = new Date(date).getTime();
    const diff = deadline - now;
    const oneDay = 24 * 60 * 60 * 1000;

    if (diff < 0) return 'red';
    if (diff <= oneDay) return 'orange';
    return 'white';
  }

  getFormattedDate(date: string | Date): string {
    const localDate = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${localDate.getFullYear()}-${pad(localDate.getMonth() + 1)}-${pad(localDate.getDate())}T${pad(localDate.getHours())}:${pad(localDate.getMinutes())}`;
  }

  //7777
  async getBoardListsWithCards(userId: number, boardId: number) {
    const access = await this.prisma.boardUserAccess.findFirst({
      where: { userId, boardId },

    });

    if (!access) return [];

    const lists = await this.prisma.list.findMany({
      where: { boardId },
      include: { Cards: true },
    });

    return lists.map((list) => ({
      ...list,
      Cards: list.Cards.map((card) => {
        const rawDate =
          card.data instanceof Date ? card.data.toISOString() : card.data;
        const formattedDate = rawDate ? this.getFormattedDate(rawDate) : null;

        return {
          ...card,
          image: card.image
            ? `data:image/jpeg;base64,${Buffer.from(card.image).toString('base64')}`
            : null,
          data: formattedDate,
          deadlineFlag: rawDate ? this.getDeadlineFlag(rawDate) : null,
        };
      }),
    }));
  }

  async getBoardsByAccessUser(userId: number) {
    const accessBoards = await this.prisma.boardUserAccess.findMany({
      where: { userId },
      select: { boardId: true },
    });

    const boardIds = accessBoards.map((access) => access.boardId);

    if (boardIds.length === 0) {
      return [];
    }

    const boards = await this.prisma.board.findMany({
      where: {
        id: { in: boardIds },
      },
    });

    return boards;
  }

  // create update list

  async createListGuest(userId: number, boardId: number, dto: ListDto) {
    const accessList = await this.prisma.boardUserAccess.findFirst({
      where: { userId, boardId },
    });

    if (!accessList) {
      return 'error user not access this board';
    }

    if (accessList.adminUserId === null) {
      return 'error: adminUserId is null';
    }

    return this.prisma.list.create({
      data: {
        userId: accessList.adminUserId,
        boardId,
        ...dto,
      },
    });
  }

  async updateListGuest(
    userId: number,
    boardId: number,
    listId: number,
    dto: ListDto,
  ) {
    const accessList = await this.prisma.boardUserAccess.findFirst({
      where: { userId, boardId },
    });

    if (!accessList) {
      return 'error user not access this board';
    }

    if (accessList.adminUserId === null) {
      return 'error: adminUserId is null';
    }

    const list = await this.prisma.list.findUnique({
      where: {
        id: listId,
      },
    });

    // @ts-ignore
    if (!listId || list.userId !== accessList.adminUserId)
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

  // create update card

  async createCardGuest(
    userId: number,
    boardId: number,
    listId: number,
    dto: CardDto,
    image?: Buffer,
  ) {
    const accessList = await this.prisma.boardUserAccess.findFirst({
      where: { userId, boardId },
    });

    if (!accessList) {
      return 'error user not access this board';
    }

    if (accessList.adminUserId === null) {
      return 'error: adminUserId is null';
    }

    if (dto.data) {
      dto.deadlineFlag = this.getDeadlineFlag(dto.data);
    }

    const cards = await this.prisma.card.create({
      data: {
        image,
        userId: accessList.adminUserId,
        listId,
        ...dto,
      },
    });
    return cards;
  }

  async updateCardGuest(
    userId: number,
    boardId: number,
    cardId: number,
    dto: CardDto,
    image?: Buffer,
  ) {
    const accessList = await this.prisma.boardUserAccess.findFirst({
      where: { userId, boardId },
    });

    if (!accessList) {
      return 'error user not access this board';
    }

    if (accessList.adminUserId === null) {
      return 'error: adminUserId is null';
    }

    const card = await this.prisma.card.findUnique({
      where: {
        id: cardId,
      },
    });

    // @ts-ignore
    if (!cardId || card.userId !== accessList.adminUserId)
      throw new ForbiddenException(`board with id ${cardId} not found`);

    if (dto.data) {
      dto.deadlineFlag = this.getDeadlineFlag(dto.data);
    }

    return this.prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        image,
        ...dto,
      },
    });
  }

  async getBoardByAccessUser(userId: number, boardId: number) {
    const accessList = await this.prisma.boardUserAccess.findFirst({
      where: { userId, boardId },
    });

    if (!accessList) {
      return 'error user not access this board1';
    }

    if (accessList.adminUserId === null) {
      return 'error user not access this board2';
    }

    const board = await this.prisma.board.findFirst({
      where: {
        id: boardId,
        userId: accessList.adminUserId,
      },
    });

    return board;
  }

  async deleteBoardListsWithCards(
    userId: number,
    boardId: number,
    listId: number,
  ) {
    const accessList = await this.prisma.boardUserAccess.findFirst({
      where: { userId, boardId },
    });

    if (!accessList) {
      return 'error user not access this board1';
    }

    if (accessList.adminUserId === null) {
      return 'error user not access this board2';
    }

    await this.prisma.list.delete({
      where: {
        userId: accessList.adminUserId,
        id: listId,
      },
    });
  }

  async deleteCardById(userId: number, cardId: number, boardId: number) {
    const accessList = await this.prisma.boardUserAccess.findFirst({
      where: { userId, boardId },
    });

    if (!accessList) {
      return 'error user not access this board1';
    }

    if (accessList.adminUserId === null) {
      return 'error user not access this board2';
    }

    await this.prisma.card.delete({
      where: {
        userId: accessList.adminUserId,
        id: cardId,
      },
    });
  }
}
