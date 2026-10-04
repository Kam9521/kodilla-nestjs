import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { UpdateOrderDTO } from './dtos/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('/')
  async getAll() {
    return await this.ordersService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const order = await this.ordersService.getById(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  @Post('/')
  async create(@Body() orderData: CreateOrderDTO) {
    return await this.ordersService.create(orderData);
  }

  @Put('/:id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() orderData: UpdateOrderDTO,
  ) {
    const order = await this.ordersService.getById(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.ordersService.updateById(id, orderData);

    return { success: true };
  }

  @Delete('/:id')
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    const order = await this.ordersService.getById(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.ordersService.deleteById(id);

    return { success: true };
  }
}
