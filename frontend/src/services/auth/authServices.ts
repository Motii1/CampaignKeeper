import axios, { AxiosResponse } from 'axios';

export const axiosForCookies = axios.create({
  withCredentials: true,
});

const authUrl = '/api/auth';

export const register = (
  username: string,
  email: string,
  emailRepeat: string,
  password: string,
  passwordRepeat: string
): Promise<AxiosResponse> =>
  axiosForCookies.post(`${authUrl}/register`, {
    username: username,
    email: email,
    repeatedEmail: emailRepeat,
    password: password,
    repeatedPassword: passwordRepeat,
  });

export const login = (username: string, password: string): Promise<AxiosResponse> =>
  axiosForCookies.post(`${authUrl}/login`, {
    username: username,
    password: password,
  });
