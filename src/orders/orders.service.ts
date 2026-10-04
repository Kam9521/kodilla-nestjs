import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from '../shared/services/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  public async getAll(): Promise<Order[]> {
    return await this.prismaService.order.findMany();
  }

  public async getById(id: Order['id']): Promise<Order | null> {
    return await this.prismaService.order.findUnique({
      where: {
        id,
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

    return await this.prismaService.order.create({
      data: orderData,
    });
  }

  public async updateById(
    id: Order['id'],
    orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Order> {
    return await this.prismaService.order.update({
      where: {
        id,
      },
      data: orderData,
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
