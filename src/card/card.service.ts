import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CardDto } from './dto';

@Injectable()
export class CardService {
  constructor(private prisma: PrismaService) {}

  async getCardsByListId(userId: number, listId: number) {
    const cards = await this.prisma.card.findMany({
      where: {
        userId,
        listId,
      },
    });
    return cards;
  }

  async createList(userId: number, listId: number, dto: CardDto) {
    const cards = await this.prisma.card.create({
      data: {
        userId,
        listId,
        ...dto,
      },
    });
    return cards;
  }

  async updateList(userId: number, cartId: number, dto: CardDto) {
    const cart = await this.prisma.card.findUnique({
      where: {
        id: cartId,
      },
    });

    // @ts-ignore
    if (!cartId || cart.userId !== userId)
      throw new ForbiddenException(`board with id ${cartId} not found`);

    return this.prisma.card.update({
      where: {
        id: cartId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteCardById(userId: number, cardId: number) {
    const list = await this.prisma.card.findUnique({
      where: {
        id: cardId,
      },
    });

    // @ts-ignore
    if (!cardId || list.userId !== userId)
      throw new ForbiddenException(`Bookmark with id ${cardId} not found`);

    await this.prisma.card.delete({
      where: {
        id: cardId,
      },
    });
  }
}
