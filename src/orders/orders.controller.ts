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
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';

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

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
