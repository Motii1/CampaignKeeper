import request from 'supertest';
import { App } from '../../App/App';
import { OpsController, OpsRoutes } from './OpsController';

const testApp = new App([[`/ops${OpsRoutes.Ping}`, new OpsController()]]);

describe('OpsController tests', () => {
  test('Ping should return empty json with status code 200', async () => {
    const response = await request(testApp).get(`/ops${OpsRoutes.Ping}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
  });
});
