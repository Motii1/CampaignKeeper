import axios from 'axios';

export const protectedApiClient = axios.create({
  validateStatus: status => status < 500,
});
