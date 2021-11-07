import axios, { AxiosResponse } from 'axios';

export const axiosForCookies = axios.create({
  withCredentials: true,
});

export const register = (
  username: string,
  email: string,
  emailRepeat: string,
  password: string,
  passwordRepeat: string
): Promise<AxiosResponse> =>
  axiosForCookies.post('/api/register', {
    username: username,
    email: email,
    emailRepeat: emailRepeat,
    password: password,
    passwordRepeat: passwordRepeat,
  });

export const login = (username: string, password: string): Promise<AxiosResponse> =>
  axiosForCookies.post('/api/login', {
    username: username,
    password: password,
  });
