import axios from 'axios';

export const apiNest = axios.create({
  baseURL: process.env.API_URL
});