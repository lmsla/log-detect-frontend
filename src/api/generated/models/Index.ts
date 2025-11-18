/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonFields } from './CommonFields';
import type { ESConnectionSummary } from './ESConnectionSummary';
import type { Target } from './Target';
export type Index = (CommonFields & {
    /**
     * Index ID
     */
    id: number;
    /**
     * Index pattern
     */
    pattern: string;
    /**
     * Associated device group
     */
    device_group: string;
    /**
     * Log name
     */
    logname: string;
    /**
     * Time period
     */
    period: string;
    /**
     * Time unit
     */
    unit: number;
    /**
     * Field to monitor
     */
    field: string;
    /**
     * ES Connection ID (null means use default connection)
     */
    es_connection_id?: number | null;
    /**
     * Associated ES Connection details
     */
    es_connection?: ESConnectionSummary | null;
    /**
     * Associated targets
     */
    targets?: Array<Target>;
});

