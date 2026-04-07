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
import { ResearchService } from './research.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import {
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ResearchSourceDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateResearchDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  content: string;

  @IsString()
  domain: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResearchSourceDto)
  sources?: ResearchSourceDto[];

  @IsOptional()
  @IsString()
  methodology?: string;

  @IsOptional()
  @IsString()
  keyFindings?: string;

  @IsOptional()
  @IsString()
  originalAuthorName?: string;

  @IsOptional()
  @IsString()
  originalAuthorUrl?: string;

  @IsOptional()
  @IsString()
  sourceUrl?: string;
}

export class UpdateResearchDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResearchSourceDto)
  sources?: ResearchSourceDto[];

  @IsOptional()
  @IsString()
  methodology?: string;

  @IsOptional()
  @IsString()
  keyFindings?: string;
}

export class UpsertResearchDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  content: string;

  @IsString()
  domain: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResearchSourceDto)
  sources?: ResearchSourceDto[];

  @IsOptional()
  @IsString()
  methodology?: string;

  @IsOptional()
  @IsString()
  keyFindings?: string;
}

export class BulkSyncResearchDto {
  @IsArray()
  research: UpsertResearchDto[];
}

export class ResearchQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'newest' | 'popular' | 'references';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}

@ApiTags('research')
@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Search, filter, and paginate research' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'domain', required: false })
  @ApiQuery({ name: 'tag', required: false })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['newest', 'popular', 'references'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() query: ResearchQueryDto) {
    return this.researchService.findAll(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new research' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateResearchDto,
  ) {
    return this.researchService.create(userId, dto);
  }

  @Put('upsert')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create or update research by name. Compares content hash — skips update if unchanged.',
  })
  async upsert(
    @CurrentUser('id') userId: string,
    @Body() dto: UpsertResearchDto,
  ) {
    return this.researchService.upsert(userId, dto);
  }

  @Put('bulk-sync')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Sync multiple research items at once. Creates, updates, or skips each based on content hash.',
  })
  async bulkSync(
    @CurrentUser('id') userId: string,
    @Body() dto: BulkSyncResearchDto,
  ) {
    return this.researchService.bulkSync(userId, dto.research);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all research owned by the authenticated user' })
  async myResearch(@CurrentUser('id') userId: string) {
    return this.researchService.findByAuthor(userId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get research detail' })
  async findOne(@Param('id') id: string) {
    return this.researchService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update research (owner only)' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateResearchDto,
  ) {
    return this.researchService.update(userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete research (owner only)' })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.researchService.remove(userId, id);
  }

  @Post(':id/reference')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save a reference to this research (free)' })
  async reference(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.researchService.reference(userId, id);
  }

  @Post(':id/upvote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle upvote on research' })
  async upvote(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.researchService.toggleUpvote(userId, id);
  }

  @Post(':id/claim')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Claim attributed research as original author' })
  async claim(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.researchService.claimResearch(userId, id);
  }
}
