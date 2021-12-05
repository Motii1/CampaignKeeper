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
    store.dispatch(updateAxiosError({ isError: true }));
    return error;
  }
);

export default protectedApiClient;
