import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../shared/services/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  public async getAll(): Promise<Product[]> {
    return await this.prismaService.product.findMany();
  }

  public async getById(id: Product['id']): Promise<Product | null> {
    return await this.prismaService.product.findUnique({
      where: {
        id,
      },
    });
  }

  public async create(
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Product> {
    return await this.prismaService.product.create({
      data: productData,
    });
  }

  public async deleteById(id: Product['id']): Promise<Product> {
    return await this.prismaService.product.delete({
      where: {
        id,
      },
    });
  }

  public async updateById(
    id: Product['id'],
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Product> {
    return await this.prismaService.product.update({
      where: {
        id,
      },
      data: productData,
    });
  }
}
