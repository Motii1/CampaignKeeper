/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';

const protectedApiClient = axios.create({
  validateStatus: status => status < 500,
  timeout: 30000,
});
/*
protectedApiClient.interceptors.response.use(
  response => response,
  _error => store.dispatch(setError())
);
*/
export default protectedApiClient;
