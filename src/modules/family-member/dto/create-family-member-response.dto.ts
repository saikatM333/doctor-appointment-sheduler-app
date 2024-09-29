// src/dto/client.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ClientDto {
  @ApiProperty()
  tenant_id: number;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  birthdate: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  created_at: string;
}


export class FamilyMemberCreateResponseDto {
  @ApiProperty()
  family_member_id: number;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  birthdate: string;

  @ApiProperty()
  relation: string;

  @ApiProperty({ type: ClientDto }) // Reference to the client
  client: ClientDto;
}
