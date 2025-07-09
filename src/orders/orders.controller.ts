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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/error-response.dto';
import { FilterOrdersDto } from './dto/filter-orders.dto';
import {
  SingleOrderResponse,
  MultipleOrdersResponse,
} from './dto/order-response.dto';



@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

@Post()
@UseGuards(AuthGuard('jwt'))
@ApiOperation({ summary: 'Create a new order' })
@ApiBody({ type: CreateOrderDto })
@ApiResponse({ status: 201, description: 'Order created successfully',type: SingleOrderResponse })
@ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
@ApiResponse({ status: 409, description: 'Some products not found', type: ErrorResponseDto })
@ApiResponse({ status: 500, description: 'Error creating order', type: ErrorResponseDto })
create(@Body() dataNewOrder: CreateOrderDto, @Req() req: any) {
  const userId = req.user['userId'];
  return this.ordersService.create(userId, dataNewOrder);
}

@Get()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiOperation({ summary: 'Get all orders (admin only)' })
@ApiResponse({ status: 200, description: 'List of all orders', type: MultipleOrdersResponse })
@ApiResponse({ status: 403, description: 'Forbidden - only admin role allowed', type: ErrorResponseDto })
findAll() {
  return this.ordersService.findAll();
}

@Get('user')
@UseGuards(AuthGuard('jwt'))
@ApiOperation({ summary: 'Get orders made by the authenticated user' })
@ApiResponse({ status: 200, type: MultipleOrdersResponse })
@ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
findUserOrders(@Req() req: any) {
  const userId = req.user['userId'];
  return this.ordersService.findByUser(userId);
}

@Post('filter')
@UseGuards(AuthGuard('jwt'))
@ApiOperation({ summary: 'Filter orders by date and total amount' })
@ApiBody({ type: FilterOrdersDto })
@ApiResponse({ status: 200, type: MultipleOrdersResponse })
@ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
filterOrders(@Body() body: FilterOrdersDto) {
  return this.ordersService.filterOrders(body);
}

@Delete(':id')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiOperation({ summary: 'Delete an order by ID (admin only)' })
@ApiResponse({ status: 200, description: 'Order deleted successfully' })
@ApiResponse({ status: 403, description: 'Forbidden - only admin role allowed', type: ErrorResponseDto })
@ApiResponse({ status: 404, description: 'Order not found', type: ErrorResponseDto })
remove(@Param('id') id: string) {
  return this.ordersService.remove(+id);
}

}
