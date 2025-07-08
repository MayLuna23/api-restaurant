import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { errorResponse } from 'src/common/responses';
import { Http } from 'winston/lib/winston/transports';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() dataNewOrder: CreateOrderDto,
    @Req()
    req: Request & { user: { userId: number; email: string; name: string } },
  ) {
    const userId = req.user['userId'];
    return this.ordersService.create(userId, dataNewOrder);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async findUserOrders(
    @Req()
    req: Request & { user: { userId: number; email: string; name: string } },
  ) {
    const userId = req.user['userId'];
    return this.ordersService.findByUser(userId);
  }


  @Post('filter')
  @UseGuards(AuthGuard('jwt'))
  filterOrders(
    @Body()
    body: {
      startDate?: string;
      endDate?: string;
      minTotal?: number;
      maxTotal?: number;
    },
  ) {
    return this.ordersService.filterOrders(body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
