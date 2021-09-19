import request from 'supertest';
import { createApp } from '../../App/AppFactory/AppFactory';
import { OpsRoutes } from './OpsController';

const testApp = createApp();

describe('OpsController tests', () => {
  test('Ping should return empty json with status code 200', async () => {
    const response = await request(testApp).get(`/ops${OpsRoutes.Ping}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
  });
});
