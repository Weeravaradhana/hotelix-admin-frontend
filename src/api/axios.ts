import axios, {type AxiosError, type InternalAxiosRequestConfig} from "axios";
import {getAccessToken, removeAccessToken} from "../utils/auth.ts";


const GATEWAY_BASE_URL = 'http://localhost:9090';

export const apiClient = axios.create({
    baseURL: GATEWAY_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig)=>{
        const token = getAccessToken();
        if(token && config.headers){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
        },
    (error:AxiosError) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response)=> response,
    (error:AxiosError) => {
        if(error.response?.status === 401) {
            removeAccessToken();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
)




















