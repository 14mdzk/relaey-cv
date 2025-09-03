import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { PageProps as AppPageProps } from './';
import { AxiosInstance } from 'axios';

declare global {
    interface Window {
        axios: AxiosInstance;
    }
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}