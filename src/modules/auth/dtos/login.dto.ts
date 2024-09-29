// export class LoginDto {
//   email: string;
//   password: string;
// }

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user.',
  })
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'The password of the user.',
  })
  password: string;
}
