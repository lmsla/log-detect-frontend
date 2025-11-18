/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonFields } from './CommonFields';
export type ESConnection = (CommonFields & {
    /**
     * ES Connection ID
     */
    id?: number;
    /**
     * Connection name (unique)
     */
    name: string;
    /**
     * Elasticsearch host address
     */
    host: string;
    /**
     * Elasticsearch port
     */
    port?: number;
    /**
     * Authentication username
     */
    username?: string | null;
    /**
     * Authentication password (only needed for create/update)
     */
    password?: string | null;
    /**
     * Enable authentication
     */
    enable_auth?: boolean;
    /**
     * Use TLS/HTTPS
     */
    use_tls?: boolean;
    /**
     * Is default connection
     */
    is_default?: boolean;
    /**
     * Connection description
     */
    description?: string | null;
});

