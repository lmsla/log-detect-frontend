/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonFields } from './CommonFields';
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
     * Associated targets
     */
    targets?: Array<Target>;
});

