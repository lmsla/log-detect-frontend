/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonFields } from './CommonFields';
import type { Role } from './Role';
export type User = (CommonFields & {
    /**
     * User ID
     */
    id: number;
    /**
     * Unique username
     */
    username: string;
    /**
     * User email address
     */
    email: string;
    role?: Role;
    /**
     * Role ID
     */
    role_id: number;
    /**
     * Whether user is active
     */
    is_active: boolean;
});

