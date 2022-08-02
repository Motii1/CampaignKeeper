import axios from 'axios';
import { store } from '../store';
import { setError } from '../views/ErrorView/errorSlice';

/**
 * Axios instance used in application to communicate with server
 */
const protectedApiClient = axios.create({
  validateStatus: status => status < 500,
  timeout: 30000,
});

protectedApiClient.interceptors.response.use(
  response => response,
  error => {
    store.dispatch(setError({ isError: true, message: 'Internal server error' }));
    return error;
  }
);

export default protectedApiClient;
