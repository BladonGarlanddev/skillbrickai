import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpvotesService } from '../upvotes/upvotes.service';

@Injectable()
export class CommunityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly upvotesService: UpvotesService,
  ) {}

  // --- Posts ---

  async listPosts(category?: string) {
    const where: any = { parentId: null };
    if (category) {
      where.category = category;
    }

    return this.prisma.post.findMany({
      where,
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { replies: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPost(
    userId: string,
    data: { title?: string; body: string; category: string },
  ) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        body: data.body,
        category: data.category as any,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
      },
    });
  }

  async getPost(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        replies: {
          include: {
            author: {
              select: { id: true, username: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async addReply(userId: string, postId: string, body: string) {
    const parent = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!parent) {
      throw new NotFoundException('Post not found');
    }

    return this.prisma.post.create({
      data: {
        body,
        category: parent.category,
        authorId: userId,
        parentId: postId,
      },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
      },
    });
  }

  async togglePostUpvote(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.upvotesService.toggleUpvote(
      userId,
      'POST',
      postId,
      post.authorId,
    );
  }

  // --- Skill Requests ---

  async listRequests() {
    return this.prisma.skillRequest.findMany({
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { replies: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRequest(
    userId: string,
    data: { title: string; description: string },
  ) {
    return this.prisma.skillRequest.create({
      data: {
        title: data.title,
        description: data.description,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
      },
    });
  }

  async getRequest(id: string) {
    const request = await this.prisma.skillRequest.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Skill request not found');
    }

    return request;
  }

  async replyToRequest(
    userId: string,
    requestId: string,
    data: { body: string; skillId?: string },
  ) {
    const request = await this.prisma.skillRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Skill request not found');
    }

    return this.prisma.skillRequestReply.create({
      data: {
        requestId,
        authorId: userId,
        body: data.body,
        skillId: data.skillId,
      },
    });
  }

  async updateRequestStatus(
    userId: string,
    requestId: string,
    status: string,
  ) {
    const request = await this.prisma.skillRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Skill request not found');
    }

    if (request.authorId !== userId) {
      throw new ForbiddenException(
        'Only the author can update request status',
      );
    }

    return this.prisma.skillRequest.update({
      where: { id: requestId },
      data: { status: status as any },
    });
  }

  // --- Showcases ---

  async listShowcases() {
    return this.prisma.showcase.findMany({
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        skills: {
          include: {
            skill: {
              select: { id: true, name: true, description: true, domain: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createShowcase(
    userId: string,
    data: { title: string; description: string; skillIds: string[] },
  ) {
    return this.prisma.showcase.create({
      data: {
        title: data.title,
        description: data.description,
        authorId: userId,
        skills: {
          create: data.skillIds.map((skillId) => ({ skillId })),
        },
      },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        skills: {
          include: {
            skill: {
              select: { id: true, name: true, description: true, domain: true },
            },
          },
        },
      },
    });
  }

  async getShowcase(id: string) {
    const showcase = await this.prisma.showcase.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        skills: {
          include: {
            skill: {
              include: {
                author: {
                  select: { id: true, username: true, avatarUrl: true },
                },
                tags: true,
                _count: { select: { upvotes: true } },
              },
            },
          },
        },
      },
    });

    if (!showcase) {
      throw new NotFoundException('Showcase not found');
    }

    return showcase;
  }
}
