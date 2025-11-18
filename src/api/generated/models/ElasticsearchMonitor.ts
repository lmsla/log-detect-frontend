/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonFields } from './CommonFields';
export type ElasticsearchMonitor = (CommonFields & {
    /**
     * Monitor ID
     */
    id?: number;
    /**
     * Monitor name
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
    username?: string;
    /**
     * Authentication password
     */
    password?: string;
    /**
     * Enable authentication
     */
    enable_auth?: boolean;
    /**
     * Check types (comma-separated)
     */
    check_type?: string;
    /**
     * 檢查間隔（單位：秒，範圍：10-3600）
     */
    interval?: number;
    /**
     * Enable monitoring
     */
    enable_monitor?: boolean;
    /**
     * 告警接收者陣列
     */
    receivers?: Array<string>;
    /**
     * Alert email subject
     */
    subject?: string;
    /**
     * Monitor description
     */
    description?: string;
    /**
     * Alert threshold configuration (JSON string)
     */
    alert_threshold?: string;
});

