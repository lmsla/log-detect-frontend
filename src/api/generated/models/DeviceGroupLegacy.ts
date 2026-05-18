/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonFields } from './CommonFields';
/**
 * Legacy response format for backward compatibility (GET /Device/GetGroup)
 */
export type DeviceGroupLegacy = (CommonFields & {
    /**
     * Device group ID
     */
    id?: number;
    /**
     * Device group name (legacy field name for backward compatibility)
     */
    device_group?: string;
    /**
     * Device group description
     */
    description?: string;
    /**
     * Number of devices in this group
     */
    device_count?: number;
});

