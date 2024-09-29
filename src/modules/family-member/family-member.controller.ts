import { Controller, Get, Param, ParseIntPipe, Post, Body } from '@nestjs/common';
import { FamilyMemberService } from './family-member.service';
import { CreateFamilyMemberDto } from './dto/create-family-member.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse , ApiParam} from '@nestjs/swagger';
import { FamilyMemberDto } from './dto/family-member-response.dto';
//import { FamilyMemberResponseDto } from './dto/family-member-response.dto';
import { FamilyMemberCreateResponseDto} from './dto/create-family-member-response.dto';
@ApiTags('family-member') // Adds "appointments" as a tag in Swagger
@ApiBearerAuth() 

@Controller('family-members')
export class FamilyMemberController {
  constructor(private readonly familyMemberService: FamilyMemberService) {}

  @ApiOperation({ summary: 'Get all family members for a specific client' })
  @ApiParam({ name: 'clientId', required: true, description: 'Client ID to retrieve family members' })
  @ApiResponse({
    status: 200,
    description: 'List of family members',
    type: [FamilyMemberDto],
    
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication token is missing or invalid',
    schema: {
      example: {
        code: 401,
        timestamp: '2024-09-29T04:04:53.034Z',
        message: 'Unauthorized',
      }
    }
  })
  @Get(':clientId')
  async getFamilyMembers(
    @Param('clientId', ParseIntPipe) clientId: number,
  ) {
    return await this.familyMemberService.getFamilyMembers(clientId);
  }
  @ApiOperation({ summary: 'Get specific family member details by family member ID' })
  @ApiParam({ name: 'clientId', required: true, description: 'Client ID associated with the family member' })
  @ApiParam({ name: 'familyMemberId', required: true, description: 'Family Member ID' })
  @ApiResponse({
    status: 200,
    description: 'Family member details',
    type: FamilyMemberDto,
    
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication token is missing or invalid',
    schema: {
      example: {
        code: 401,
        timestamp: '2024-09-29T04:04:53.034Z',
        message: 'Unauthorized',
      }
    }
  })
  @Get(':clientId/:familyMemberId')
  async getFamilyMemberDetails(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Param('familyMemberId', ParseIntPipe) familyMemberId: number,
  ) {
    return await this.familyMemberService.getFamilyMemberDetails(clientId, familyMemberId);
  }


  @Post(':clientId')
  @ApiOperation({ summary: 'creating family member by client ID' })
  @ApiResponse({
    status: 200,
    description: 'Create family member details',
    type: FamilyMemberCreateResponseDto, // Updated response type
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication token is missing or invalid',
    schema: {
      example: {
        code: 401,
        timestamp: '2024-09-29T04:04:53.034Z',
        message: 'Unauthorized',
      }
    }
  })
  async createFamilyMember(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Body() createFamilyMemberDto: CreateFamilyMemberDto,
  ) {
    return await this.familyMemberService.createFamilyMember(clientId, createFamilyMemberDto);
  }
}
