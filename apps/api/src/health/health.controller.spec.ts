import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TerminusModule,
        ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 100 }] }),
      ],
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('liveness() should return a health check result', async () => {
    const result = await controller.liveness();
    expect(result).toHaveProperty('status');
    expect(result.status).toBe('ok');
  });

  it('readiness() should return a health check result', async () => {
    const result = await controller.readiness();
    expect(result).toHaveProperty('status');
    expect(result.status).toBe('ok');
  });
});
