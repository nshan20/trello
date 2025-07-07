import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListDto } from './dto';
import { CardService } from '../card/card.service';

@Injectable()
export class ListService {
  constructor(
    private prisma: PrismaService,
    private cardService: CardService,
  ) {}

  async getListByBoardId(userId: number, boardId: number) {
    return this.prisma.list.findMany({
      where: {
        userId,
        boardId,
      },
    });
  }

  async getListsWithCards(userId: number, boardId: number) {
    const lists = await this.getListByBoardId(userId, boardId);

    const listsInCards = await Promise.all(
      lists.map(async (list) => {
        const cardsList = await this.cardService.getCardsByListId(
          userId,
          list.id,
        );

        const cardsWithImage = cardsList.map((card) => {
          const rawDate =
            card.data instanceof Date ? card.data.toISOString() : card.data;

          const formattedDate = rawDate
            ? (() => {
                const localDate = new Date(rawDate);
                const pad = (n: number) => n.toString().padStart(2, '0');
                return `${localDate.getFullYear()}-${pad(localDate.getMonth() + 1)}-${pad(localDate.getDate())}T${pad(localDate.getHours())}:${pad(localDate.getMinutes())}`;
              })()
            : null;

          return {
            ...card,
            image: card.image
              ? `data:image/jpeg;base64,${Buffer.from(card.image).toString('base64')}`
              : null,
            data: formattedDate,
          };
        });

        return { list, cards: cardsWithImage };
      }),
    );

    return listsInCards;
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
