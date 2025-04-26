import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply same middleware as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    // Clean database before tests
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/api').expect(404); // Default route not defined
  });

  describe('/users', () => {
    it('should create a user', async () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email', 'test@example.com');
          expect(res.body).toHaveProperty('name', 'Test User');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should not create a user with duplicate email', async () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Another User',
        })
        .expect(409); // Conflict - unique constraint violation
    });

    it('should get users with pagination', async () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(res.body.meta).toHaveProperty('total');
          expect(res.body.meta).toHaveProperty('page');
          expect(res.body.meta).toHaveProperty('limit');
          expect(res.body.meta).toHaveProperty('totalPages');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });
});
