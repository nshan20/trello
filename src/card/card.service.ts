import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CardDto } from './dto';
import { CardFilterDto } from './dto/cardFilterDto';
import { UserAccessService } from '../user-access/user-access.service';

@Injectable()
export class CardService {
  constructor(
    private prisma: PrismaService,
    private userAccessService: UserAccessService,
  ) {}

  async getCardsByListId(userId: number, listId: number) {
    const cards = await this.prisma.card.findMany({
      where: {
        userId,
        listId,
      },
    });
    return cards;
  }

  async createList(
    userId: number,
    listId: number,
    dto: CardDto,
    image?: Buffer,
  ) {
    if (dto.data) {
      dto.deadlineFlag = this.getDeadlineFlag(dto.data);
    }

    const cards = await this.prisma.card.create({
      data: {
        image,
        userId,
        listId,
        ...dto,
      },
    });
    return cards;
  }

  async updateList(
    userId: number,
    cardId: number,
    dto: CardDto,
    image?: Buffer,
  ) {
    const card = await this.prisma.card.findUnique({ where: { id: cardId } });

    if (!card || card.userId !== userId)
      throw new ForbiddenException(`card with id ${cardId} not found`);

    if (dto.data) {
      dto.deadlineFlag = this.getDeadlineFlag(dto.data);
    }

    return this.prisma.card.update({
      where: { id: cardId },
      data: {
        ...dto,
        ...(image && { image }),
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

  getDeadlineFlag(dateString: Date): 'red' | 'yellow' | 'white' {
    const now = new Date().getTime();
    const deadline = new Date(dateString).getTime();
    const diff = deadline - now;
    const oneDay = 24 * 60 * 60 * 1000;

    if (diff < 0) return 'red';
    else if (diff <= oneDay) return 'yellow';
    else return 'white';
  }

  async getAllCards(userId: number, filterDto: CardFilterDto = {}) {
    const {
      search,
      priority,
      deadlineFlag,
      access,
      page = 1,
      limit = 10,
    } = filterDto;

    let where: any;

    if (access === 'access') {
      where = {
        list: {
          board: {
            AccessibleUsers: {
              some: {
                adminUserId: userId,
              },
            },
          },
        },
      };
    } else {
      where = { userId };
    }

    if (priority?.trim()) {
      where.priority = priority;
    }

    if (['red', 'yellow', 'white'].includes(<string>deadlineFlag)) {
      where.deadlineFlag = deadlineFlag;
    }

    if (search?.trim()) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Prisma query:
    const [cards, total] = await Promise.all([
      this.prisma.card.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createAt: 'desc' },
        include: {
          list: {
            include: {
              board: {
                include: {
                  AccessibleUsers: {
                    include: {
                      user: { select: { email: true } },
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.card.count({ where }),
    ]);

    const data = cards.map((card) => {
      const access = card.list.board.AccessibleUsers.map((a) => ({
        email: a.user.email,
        grantedBy: a.adminUserId,
        role: a.role,
      }));

      return { card, access };
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
