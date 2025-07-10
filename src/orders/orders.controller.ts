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
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: SingleOrderResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 409,
    description: 'Some products not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Error creating order',
    type: ErrorResponseDto,
  })
  create(@Body() dataNewOrder: CreateOrderDto, @Req() req: any) {
    const userId = req.user['userId'];
    return this.ordersService.create(userId, dataNewOrder);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Get all orders (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all orders',
    type: MultipleOrdersResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - only admin role allowed',
  })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get orders made by the authenticated user' })
  @ApiResponse({ status: 200, type: MultipleOrdersResponse })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findUserOrders(
    @Req()
    req: Request & { user: { userId: number; email: string; name: string } },
  ) {
    const userId = req.user['userId'];
    return this.ordersService.findByUser(userId);
  }

  @Post('filter')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Filter orders by date, total amount and userId',
    description: `This endpoint allows filtering of orders based on provided criteria:
    
    - Admins can optionally filter by a specific user using \`bodyUserId\`.
    - If no \`bodyUserId\` is provided by an admin, all orders will be returned.
    - Non-admin users will always get only their own orders based on their JWT.`,
  })
  @ApiBody({ type: FilterOrdersDto })
  @ApiResponse({
    status: 200,
    description: 'List of orders matching the filter',
    type: MultipleOrdersResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized – JWT is missing or invalid'
  })
  filterOrders(
    @Body() body: FilterOrdersDto,
    @Req()
    req: Request & {
      user: { userId: number; email: string; name: string; role: string };
    },
  ) {
    let dataWithId = {};

    if (req.user['role'] === 'admin' && body.bodyUserId) {
      dataWithId = body;
    } else if (req.user['role'] === 'admin' && !body.bodyUserId) {
      dataWithId = { ...body, userId: null };
    } else if (req.user['role'] !== 'admin') {
      dataWithId = { ...body, userId: req.user['userId'] };
    }

    return this.ordersService.filterOrders(dataWithId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Delete an order by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - only admin role allowed',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
