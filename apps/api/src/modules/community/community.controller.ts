import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  body: string;

  @IsEnum(['GENERAL', 'HELP', 'IDEAS', 'SHOW_AND_TELL'])
  category: string;
}

export class CreateReplyDto {
  @IsString()
  body: string;
}

export class CreateRequestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class RequestReplyDto {
  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  skillId?: string;
}

export class UpdateRequestStatusDto {
  @IsEnum(['OPEN', 'FULFILLED'])
  status: string;
}

export class CreateShowcaseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  skillIds: string[];
}

@ApiTags('community')
@Controller()
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // --- Posts ---

  @Public()
  @Get('community/posts')
  @ApiOperation({ summary: 'List posts with reply counts' })
  @ApiQuery({ name: 'category', required: false })
  async listPosts(@Query('category') category?: string) {
    return this.communityService.listPosts(category);
  }

  @Post('community/posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a post' })
  async createPost(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePostDto,
  ) {
    return this.communityService.createPost(userId, dto);
  }

  @Public()
  @Get('community/posts/:id')
  @ApiOperation({ summary: 'Get post with replies' })
  async getPost(@Param('id') id: string) {
    return this.communityService.getPost(id);
  }

  @Post('community/posts/:id/replies')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a reply to a post' })
  async addReply(
    @CurrentUser('id') userId: string,
    @Param('id') postId: string,
    @Body() dto: CreateReplyDto,
  ) {
    return this.communityService.addReply(userId, postId, dto.body);
  }

  @Post('community/posts/:id/upvote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle upvote on a post' })
  async upvotePost(
    @CurrentUser('id') userId: string,
    @Param('id') postId: string,
  ) {
    return this.communityService.togglePostUpvote(userId, postId);
  }

  // --- Skill Requests ---

  @Public()
  @Get('requests')
  @ApiOperation({ summary: 'List skill requests' })
  async listRequests() {
    return this.communityService.listRequests();
  }

  @Post('requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a skill request' })
  async createRequest(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateRequestDto,
  ) {
    return this.communityService.createRequest(userId, dto);
  }

  @Public()
  @Get('requests/:id')
  @ApiOperation({ summary: 'Get request with replies' })
  async getRequest(@Param('id') id: string) {
    return this.communityService.getRequest(id);
  }

  @Post('requests/:id/replies')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reply to a skill request' })
  async replyToRequest(
    @CurrentUser('id') userId: string,
    @Param('id') requestId: string,
    @Body() dto: RequestReplyDto,
  ) {
    return this.communityService.replyToRequest(userId, requestId, dto);
  }

  @Patch('requests/:id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark request as fulfilled' })
  async updateRequestStatus(
    @CurrentUser('id') userId: string,
    @Param('id') requestId: string,
    @Body() dto: UpdateRequestStatusDto,
  ) {
    return this.communityService.updateRequestStatus(
      userId,
      requestId,
      dto.status,
    );
  }

  // --- Showcases ---

  @Public()
  @Get('showcases')
  @ApiOperation({ summary: 'List showcases' })
  async listShowcases() {
    return this.communityService.listShowcases();
  }

  @Post('showcases')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a showcase' })
  async createShowcase(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateShowcaseDto,
  ) {
    return this.communityService.createShowcase(userId, dto);
  }

  @Public()
  @Get('showcases/:id')
  @ApiOperation({ summary: 'Get showcase detail' })
  async getShowcase(@Param('id') id: string) {
    return this.communityService.getShowcase(id);
  }
}
