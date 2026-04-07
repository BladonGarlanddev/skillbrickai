import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async listServices() {
    return this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getService(slug: string) {
    const service = await this.prisma.service.findUnique({
      where: { slug },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async createOrder(serviceId: string, userId: string, notes?: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || !service.isActive) {
      throw new NotFoundException('Service not found or unavailable');
    }

    return this.prisma.serviceOrder.create({
      data: {
        serviceId,
        userId,
        paidAmount: service.price,
        notes,
        status: 'PENDING',
      },
      include: { service: true },
    });
  }

  async getMyOrders(userId: string) {
    return this.prisma.serviceOrder.findMany({
      where: { userId },
      include: { service: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrder(orderId: string, userId: string) {
    const order = await this.prisma.serviceOrder.findFirst({
      where: { id: orderId, userId },
      include: { service: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
