import axios from 'axios';
import { store } from '../store';
import { updateAxiosError } from './axiosErrorSlice';

const protectedApiClient = axios.create({
  validateStatus: status => status < 500,
  timeout: 30000,
});

protectedApiClient.interceptors.response.use(
  response => response,
  error => {
    const errorStatus = error.status;
    switch (errorStatus) {
      case 500:
        store.dispatch(
          updateAxiosError({ isError: true, status: errorStatus, message: 'Internal server error' })
        );
        break;
      case 502:
      case 503:
      case 504:
        store.dispatch(
          updateAxiosError({ isError: true, status: errorStatus, message: 'Server unavailable' })
        );
        break;
      default:
        store.dispatch(
          updateAxiosError({
            isError: true,
            status: errorStatus,
            message: 'Connection to server error',
          })
        );
        break;
    }
    return error;
  }
);

export default protectedApiClient;
