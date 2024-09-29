import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentDetailsController } from './appointment-details.controller';

describe('AppointmentDetailsController', () => {
  let controller: AppointmentDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentDetailsController],
    }).compile();

    controller = module.get<AppointmentDetailsController>(AppointmentDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
