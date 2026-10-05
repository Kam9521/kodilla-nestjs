import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from '../shared/services/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  public async getAll(): Promise<Order[]> {
    return await this.prismaService.order.findMany({
      include: {
        product: true,
        client: true,
      },
    });
  }

  public async getById(id: Order['id']): Promise<Order | null> {
    return await this.prismaService.order.findUnique({
      where: {
        id,
      },
      include: {
        product: true,
        client: true,
      },
    });
  }

  public async create(
    orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Order> {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: orderData.productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const client = await this.prismaService.client.findUnique({
      where: {
        id: orderData.clientId,
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const { productId, clientId } = orderData;

    return await this.prismaService.order.create({
      data: {
        product: {
          connect: { id: productId },
        },
        client: {
          connect: { id: clientId },
        },
      },
    });
  }

  public async updateById(
    id: Order['id'],
    orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Order> {
    const { productId, clientId } = orderData;

    return await this.prismaService.order.update({
      where: {
        id,
      },
      data: {
        product: {
          connect: { id: productId },
        },
        client: {
          connect: { id: clientId },
        },
      },
    });
  }

  public async deleteById(id: Order['id']): Promise<Order> {
    return await this.prismaService.order.delete({
      where: {
        id,
      },
    });
  }
}
