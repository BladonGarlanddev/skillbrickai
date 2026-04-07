import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  serviceId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

@ApiTags('services')
@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all available paid services' })
  listServices() {
    return this.servicesService.listServices();
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get service details by slug' })
  getService(@Param('slug') slug: string) {
    return this.servicesService.getService(slug);
  }

  @Post('orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a service order (request a paid service)' })
  createOrder(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.servicesService.createOrder(dto.serviceId, userId, dto.notes);
  }

  @Get('orders/mine')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my service orders' })
  getMyOrders(@CurrentUser('id') userId: string) {
    return this.servicesService.getMyOrders(userId);
  }

  @Get('orders/:orderId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific service order' })
  getOrder(
    @Param('orderId') orderId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.servicesService.getOrder(orderId, userId);
  }
}
