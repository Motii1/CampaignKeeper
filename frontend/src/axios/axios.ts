import axios from 'axios';

const protectedApiClient = axios.create({
  validateStatus: status => status < 500,
  timeout: 30000,
});

export default protectedApiClient;
