import type { AxiosResponse } from 'axios';
import axios from 'axios';

export const mainAxios = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL!,
	timeout: 10000,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

mainAxios.interceptors.response.use(
	(response): AxiosResponse<unknown, unknown> => {
		return response;
	},
	async (error) => {
		if (Boolean(error.response) && error.response.status === 401) {
		}
		return Promise.reject(error);
	},
);
