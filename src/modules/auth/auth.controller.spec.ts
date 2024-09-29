// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { RegisterDto } from './dtos/register.dto';
// import { LoginDto } from './dtos/login.dto';

// describe('AuthController', () => {
//   let controller: AuthController;
//   let authService: AuthService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AuthController],
//       providers: [
//         {
//           provide: AuthService,
//           useValue: {
//             register: jest.fn(),
//             login: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     controller = module.get<AuthController>(AuthController);
//     authService = module.get<AuthService>(AuthService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   describe('register', () => {
//     it('should call authService.register with the provided registerDto', async () => {
//       const registerDto: RegisterDto = { username: 'testuser', email: 'test@example.com', password: 'password' };
//       await controller.register(registerDto);

//       expect(authService.register).toHaveBeenCalledWith(registerDto);
//     });
//   });

//   describe('login', () => {
//     it('should call authService.login with the provided loginDto', async () => {
//       const loginDto: LoginDto = { username: 'testuser', password: 'password' };
//       await controller.login(loginDto);

//       expect(authService.login).toHaveBeenCalledWith(loginDto);
//     });
//   });
// });
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller'; // Update path for ClientController
import { AuthService } from './auth.service';       // Update path for ClientService
import { RegisterDto } from './dtos/register.dto'; // RegisterClient DTO
import { LoginDto } from './dtos/login.dto';   // Login DTO remains same

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call clientService.register with the provided registerClientDto', async () => {
      const registerClientDto: RegisterDto = { 
        first_name: 'John', 
        last_name: 'Doe', 
        email: 'john.doe@example.com', 
        phone: '1234567890', 
        birthdate: new Date('1990-01-01'), 
        gender: 'M', 
        address: '123 Main St', 
        password: 'password' 
      };

      await controller.register(registerClientDto);
      expect(authService.register).toHaveBeenCalledWith(registerClientDto);
    });
  });

  describe('login', () => {
    it('should call clientService.login with the provided loginDto', async () => {
      const loginDto: LoginDto = { email: 'john.doe@example.com', password: 'password' };
      await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
