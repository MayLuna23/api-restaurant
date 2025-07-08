import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { errorResponse, successResponse } from 'src/common/responses';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dataNewOrder: CreateOrderDto) {
    try {
      const { items } = dataNewOrder;

      // Get Total
      const productIds = items.map((item) => item.productId);
      const products = await this.prisma.product.findMany({
        where: { productId: { in: productIds } },
      });

      if (products.length !== items.length) {
        throw new ConflictException(
          errorResponse(409, 'Some products not found'),
        );
      }

      let total = 0;
      const orderItemsData = items.map((item) => {
        const product = products.find((p) => p.productId === item.productId);
        if (!product) {
          throw new NotFoundException(
            errorResponse(404, `Product with ID ${item.productId} not found`),
          );
        }

        total += product.price * item.quantity;

        return {
          productId: item.productId,
          quantity: item.quantity,
        };
      });

      // Crear la orden y los items
      const order = await this.prisma.order.create({
        data: {
          userId,
          total,
          OrderItem: {
            create: orderItemsData,
          },
        },
        include: {
          OrderItem: {
            include: {
              product: true,
            },
          },
        },
      });

      return successResponse(order, 201, 'Order created successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        errorResponse(500, 'Error creating order', error.message),
      );
    }
  }

  async findAll() {
    try {
      const orders = await this.prisma.order.findMany({
        include: {
          user: {
            select: {
              name: true,
            },
          },
          OrderItem: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return successResponse(orders, 200, 'Orders fetched successfully');
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse(500, 'Error fetching orders', error.message),
      );
    }
  }

  async findByUser(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        OrderItem: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(orders, 200, 'Orders by user fetched successfully');
  }

  async remove(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { orderId },
    });

    if (!order) {
      throw new NotFoundException(errorResponse(404, 'Order not found'));
    }

    await this.prisma.order.delete({ where: { orderId } });
    return successResponse(null, 200, 'Order deleted successfully');
  }

  async filterOrders({
    startDate,
    endDate,
    minTotal,
    maxTotal,
  }: {
    startDate?: string;
    endDate?: string;
    minTotal?: number;
    maxTotal?: number;
  }) {
    try {
      const where: any = {};

      if (startDate && endDate) {
        where.createdAt = {
          gte: new Date(`${startDate}T00:00:00`),
          lte: new Date(`${endDate}T23:59:59.999`),
        };
      }

      if (minTotal !== undefined && maxTotal !== undefined) {
        where.total = {
          gte: minTotal,
          lte: maxTotal,
        };
      }

      const orders = await this.prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true } },
          OrderItem: { include: { product: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return successResponse(orders, 200, 'Orders filtered successfully');
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse(500, 'Error filtering orders', error.message),
      );
    }
  }
}
