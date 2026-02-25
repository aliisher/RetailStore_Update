import axios from 'axios';
import {Config} from './Config';

const baseUrl = Config.baseUrl;

export const apiHeaders = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

axios.defaults.headers.common['Cache-Control'] = 'no-cache';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.headers.common['Accept'] = 'application/json';

export const request = {
  get: url => axios.get(`${baseUrl}${url}`),
  post: (url, data) => axios.post(`${baseUrl}${url}`, data),
  delete: (url, id) => axios.delete(`${baseUrl}${url}`, id),
};
