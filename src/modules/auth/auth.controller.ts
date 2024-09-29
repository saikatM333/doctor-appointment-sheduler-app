// import { Controller, Post, Body, UseGuards, SetMetadata, HttpCode } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { LoginDto } from './dtos/login.dto';
// import { RegisterDto } from './dtos/register.dto';
// import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

// @ApiTags('auth') // Adds "appointments" as a tag in Swagger
// @ApiBearerAuth() 

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) { }

//   @SetMetadata('public', true) // Mark the route as public
//   @Post('register')
//   async register(@Body() registerDto: RegisterDto) {
//     return this.authService.register(registerDto);
//   }

//   @SetMetadata('public', true) // Mark the route as public
//   @Post('login')
//   @HttpCode(200)
//   async login(@Body() loginDto: LoginDto) {
//     return this.authService.login(loginDto);
//   }

//   @Post('protected-route')
//   protectedRoute() {
//     return 'This route is protected by JWT authentication';
//   }
// }

import { Controller, Post, Body, UseGuards, SetMetadata, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth') // Adds "auth" as a tag in Swagger
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SetMetadata('public', true) // Mark the route as public
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        first_name: "sam2",
        last_name: "man",
        email: "sam2@example.com",
        phone: "+1234567890",
        birthdate: "1990-05-20T00:00:00.000Z",
        gender: "M",
        address: "123 Main Street, City, Country",
        password: "$2b$10$18Glzf7irdkrI1cgmrwkZ.FMatVAYwgsPPLcNZIajPAmBb1.Xzeta",
        tenant_id: 4,
        created_at: "2024-09-09T12:11:25.299Z"
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @SetMetadata('public', true) // Mark the route as public
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user and return access token' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      example: {
        access_token: "String"
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('protected-route')
  @ApiOperation({ summary: 'Access a protected route' })
  @ApiResponse({
    status: 200,
    description: 'Protected route accessed',
    schema: {
      example: "This route is protected by JWT authentication",
    },
  })
  protectedRoute() {
    return 'This route is protected by JWT authentication';
  }
}
