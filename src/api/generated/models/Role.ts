/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonFields } from './CommonFields';
import type { Permission } from './Permission';
export type Role = (CommonFields & {
    /**
     * Role ID
     */
    id: number;
    /**
     * Role name
     */
    name: string;
    /**
     * Role description
     */
    description?: string;
    permissions?: Array<Permission>;
});

