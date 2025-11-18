/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonFields } from './CommonFields';
export type Permission = (CommonFields & {
    /**
     * Permission ID
     */
    id: number;
    /**
     * Permission name (resource:action format)
     */
    name: string;
    /**
     * Resource name
     */
    resource: string;
    /**
     * Action name
     */
    action: string;
    /**
     * Permission description
     */
    description?: string;
});

