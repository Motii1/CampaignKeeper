import request from 'supertest';
import { dropDb, initDb } from '../../../../Common/Test/Database';
import {
  insertMockedUser,
  MOCKED_AUTH_TOKEN,
  MOCKED_USER,
  MOCKED_USER_PASS,
} from '../../../../Common/Test/Token';
import { UserLoginData } from '../../../../Domain/User/Dto/UserLoginData';
import { UserRegisterData } from '../../../../Domain/User/Dto/UserRegisterData';
import { App } from '../../../App/App';
import { TOKEN_COOKIE_NAME } from '../../../AppConstants';
import { AuthController, AuthRoutes } from '../AuthController';

const BASE_ENDPOINT = '/api/auth';
const testApp = new App([['/auth', new AuthController()]]);

const registerBody: UserRegisterData = {
  email: 'sample@gmail.com',
  password: 'Pass@123',
  repeatedEmail: 'sample@gmail.com',
  repeatedPassword: 'Pass@123',
  username: 'Test@123',
};

describe('AuthController test', () => {
  beforeEach(async () => await initDb());
  afterEach(async () => await dropDb());

  it('should return 403 if user is unauthorized', async () => {
    const response = await request(testApp.getRouter()).post(
      `${BASE_ENDPOINT}${AuthRoutes.Logout}`
    );
    expect(response.status).toEqual(403);
    expect(response.body).toEqual({});
  });

  it('should register new user', async () => {
    const response = await request(testApp.getRouter())
      .post(`${BASE_ENDPOINT}${AuthRoutes.Register}`)
      .send(registerBody);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
  });

  it('should not register conflicting user', async () => {
    await request(testApp.getRouter())
      .post(`${BASE_ENDPOINT}${AuthRoutes.Register}`)
      .send(registerBody);
    const response = await request(testApp.getRouter())
      .post(`${BASE_ENDPOINT}${AuthRoutes.Register}`)
      .send(registerBody);

    expect(response.status).toEqual(200);
    expect(response.body.message).toBeDefined();
  });

  it('should correctly login by nickaname', async () => {
    await insertMockedUser();
    const body: UserLoginData = {
      username: MOCKED_USER.username,
      password: MOCKED_USER_PASS,
    };
    const response = await request(testApp.getRouter())
      .post(`${BASE_ENDPOINT}${AuthRoutes.Login}`)
      .send(body);
    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual(MOCKED_USER.username);
    expect(response.body.email).toEqual(MOCKED_USER.email);
    expect(response.body.image).toBeTruthy();
  });

  it('should correctly login by email', async () => {
    await insertMockedUser();
    const body: UserLoginData = {
      username: MOCKED_USER.email,
      password: MOCKED_USER_PASS,
    };
    const response = await request(testApp.getRouter())
      .post(`${BASE_ENDPOINT}${AuthRoutes.Login}`)
      .send(body);
    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual(MOCKED_USER.username);
    expect(response.body.email).toEqual(MOCKED_USER.email);
    expect(response.body.image).toBeTruthy();
  });

  it('should not login if data does not match user', async () => {
    const body: UserLoginData = {
      username: 'Test@123',
      password: 'TestTest@123',
    };
    const response = await request(testApp.getRouter())
      .post(`${BASE_ENDPOINT}${AuthRoutes.Login}`)
      .send(body);
    expect(response.status).toEqual(401);
  });

  it('should correctly logout', async () => {
    const response = await request(testApp.getRouter())
      .post(`${BASE_ENDPOINT}${AuthRoutes.Logout}`)
      .set('Cookie', `${TOKEN_COOKIE_NAME}=${MOCKED_AUTH_TOKEN}`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
  });
});
