import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserSchema } from 'src/schema/user';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { MongoObjectId } from 'src/types/objectId';
import { Task, TaskSchema } from 'src/schema/task';
import { AppModule } from 'src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let userModel: Model<User>;
  let taskModel: Model<Task>;
  let jwtToken: string;
  let taskId: MongoObjectId;
  let userId: MongoObjectId;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGO_URI!),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
        JwtModule,
      ],
      providers: [UsersService],
    }).compile();

    userModel = module.get<Model<User>>(getModelToken(User.name));
    taskModel = module.get<Model<Task>>(getModelToken(Task.name));
    await userModel.deleteMany({});
    await taskModel.deleteMany({});
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('AoK!');
  });

  it('(POST) should sign up a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        name: 'Test',
        email: 'test@example.com',
        password: 'Test123',
      })
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    userId = res.body._id;
  });

  it('(POST) should login existing user', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'test@example.com',
        password: 'Test123',
      })
      .expect(200);

    expect(res.body).toHaveProperty('accessToken');
    jwtToken = res.body.accessToken;
  });

  it('(POST) should create a new task', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'test',
      })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    taskId = res.body._id;
  });

  it('(PUT) should update an existing task', async () => {
    const res = await request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .send({
        description: 'test',
      })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    console.log(res.body);
    expect(res.body.description).toEqual('test');
  });

  it('(PATCH) should assign an existing task', async () => {
    const res = await request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .send({
        assignedTo: userId,
      })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    expect(res.body.assignedTo).toEqual(userId);
  });

  it('(PATCH) should assign an existing task', async () => {
    const res = await request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .send({
        assignedTo: userId,
      })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    expect(res.body.assignedTo).toEqual(userId);
  });

  it('(DELETE) should update an existing task', async () => {
    const res = await request(app.getHttpServer())
      .del(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    console.log(res.body);
    expect(res.body.deleted).toEqual(true);
  });
});
