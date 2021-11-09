/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';

const protectedApiClient = axios.create({
  validateStatus: status => status < 500,
});

protectedApiClient.interceptors.response.use(
  response => response,
  _error => {
    console.log('Error during connection to server');
  }
);

export default protectedApiClient;
