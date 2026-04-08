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
import { SkillsService } from './skills.service';
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

export class CreateSkillDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsString()
  @MaxLength(15000)
  content: string;

  @IsString()
  @MaxLength(100)
  domain: string;

  @IsOptional()
  @IsIn(['PUBLIC', 'PRIVATE'])
  visibility?: 'PUBLIC' | 'PRIVATE';

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  testedOn?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(200)
  originalAuthorName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  originalAuthorUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  sourceUrl?: string;
}

export class UpdateSkillDto {
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
  @MaxLength(15000)
  content?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  domain?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  testedOn?: string[];
}

export class UpsertSkillDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsString()
  @MaxLength(15000)
  content: string;

  @IsString()
  @MaxLength(100)
  domain: string;

  @IsOptional()
  @IsIn(['PUBLIC', 'PRIVATE'])
  visibility?: 'PUBLIC' | 'PRIVATE';

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  testedOn?: string[];
}

export class BulkSyncDto {
  @IsArray()
  @ArrayMaxSize(25)
  skills: UpsertSkillDto[];
}

export class SkillQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  domain?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  tag?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'newest' | 'popular' | 'installs';

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

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Search, filter, and paginate skills' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'domain', required: false })
  @ApiQuery({ name: 'tag', required: false })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['newest', 'popular', 'installs'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() query: SkillQueryDto) {
    return this.skillsService.findAll(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new skill' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSkillDto,
  ) {
    return this.skillsService.create(userId, dto);
  }

  @Put('upsert')
  @UseGuards(JwtAuthGuard)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create or update a skill by name. Compares content hash — skips update if unchanged.',
  })
  async upsert(
    @CurrentUser('id') userId: string,
    @Body() dto: UpsertSkillDto,
  ) {
    return this.skillsService.upsert(userId, dto);
  }

  @Put('bulk-sync')
  @UseGuards(JwtAuthGuard)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Sync multiple skills at once. Creates, updates, or skips each based on content hash.',
  })
  async bulkSync(
    @CurrentUser('id') userId: string,
    @Body() dto: BulkSyncDto,
  ) {
    return this.skillsService.bulkSync(userId, dto.skills);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all skills owned by the authenticated user with version info' })
  async mySkills(@CurrentUser('id') userId: string) {
    return this.skillsService.findByAuthor(userId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get skill detail' })
  async findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a skill (owner only)' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSkillDto,
  ) {
    return this.skillsService.update(userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a skill (owner only)' })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.skillsService.remove(userId, id);
  }

  @Post(':id/install')
  @UseGuards(JwtAuthGuard)
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Install a skill (costs 1 token)' })
  async install(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.skillsService.install(userId, id);
  }

  @Post(':id/upvote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle upvote on a skill' })
  async upvote(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.skillsService.toggleUpvote(userId, id);
  }

  @Post(':id/claim')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Claim an attributed skill as original author' })
  async claim(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.skillsService.claimSkill(userId, id);
  }
}
