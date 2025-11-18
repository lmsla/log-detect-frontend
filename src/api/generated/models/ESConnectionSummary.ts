/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ESConnectionSummary = {
    /**
     * ES Connection ID
     */
    id: number;
    /**
     * Connection name
     */
    name: string;
    /**
     * Elasticsearch host address
     */
    host: string;
    /**
     * Elasticsearch port
     */
    port: number;
    /**
     * Enable authentication
     */
    enable_auth: boolean;
    /**
     * Use TLS/HTTPS
     */
    use_tls: boolean;
    /**
     * Is default connection
     */
    is_default: boolean;
    /**
     * Connection description
     */
    description?: string | null;
    /**
     * Connection status (online, offline, unknown)
     */
    status?: string | null;
};

