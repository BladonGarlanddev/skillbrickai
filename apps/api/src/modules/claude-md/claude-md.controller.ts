import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ClaudeMdService } from './claude-md.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import {
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  IsIn,
  Min,
  Max,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClaudeMdDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsString()
  @MaxLength(30000)
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  projectUrl?: string;

  @IsOptional()
  @IsIn(['PUBLIC', 'PRIVATE'])
  visibility?: 'PUBLIC' | 'PRIVATE';

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  tags?: string[];
}

export class UpdateClaudeMdDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30000)
  content?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  projectUrl?: string;

  @IsOptional()
  @IsIn(['PUBLIC', 'PRIVATE'])
  visibility?: 'PUBLIC' | 'PRIVATE';

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  tags?: string[];
}

export class UpsertClaudeMdDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsString()
  @MaxLength(30000)
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  projectUrl?: string;

  @IsOptional()
  @IsIn(['PUBLIC', 'PRIVATE'])
  visibility?: 'PUBLIC' | 'PRIVATE';

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  tags?: string[];
}

export class ClaudeMdQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  tag?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'newest' | 'installs';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

@ApiTags('claude-md')
@Controller('claude-md')
export class ClaudeMdController {
  constructor(private readonly claudeMdService: ClaudeMdService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Search and browse public CLAUDE.md files' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'tag', required: false })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['newest', 'installs'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() query: ClaudeMdQueryDto) {
    return this.claudeMdService.findAll(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save a CLAUDE.md file' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateClaudeMdDto,
  ) {
    return this.claudeMdService.create(userId, dto);
  }

  @Put('upsert')
  @UseGuards(JwtAuthGuard)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create or update a CLAUDE.md by name. Compares content hash — skips update if unchanged.',
  })
  async upsert(
    @CurrentUser('id') userId: string,
    @Body() dto: UpsertClaudeMdDto,
  ) {
    return this.claudeMdService.upsert(userId, dto);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all CLAUDE.md files owned by the authenticated user' })
  async myClaudeMds(@CurrentUser('id') userId: string) {
    return this.claudeMdService.findByAuthor(userId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get CLAUDE.md detail' })
  async findOne(@Param('id') id: string) {
    return this.claudeMdService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a CLAUDE.md file (owner only)' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateClaudeMdDto,
  ) {
    return this.claudeMdService.update(userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a CLAUDE.md file (owner only)' })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.claudeMdService.remove(userId, id);
  }
}
