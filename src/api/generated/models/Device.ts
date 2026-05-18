/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonFields } from './CommonFields';
export type Device = (CommonFields & {
    /**
     * Device ID
     */
    id: number;
    /**
     * Device group name (corresponds to DeviceGroup.name)
     */
    device_group: string;
    /**
     * Device hostname
     */
    name: string;
    /**
     * HA cluster identifier. Devices sharing the same ha_group belong to the same
     * HA cluster and only trigger an alert when ALL members in the group are offline.
     * Empty string means the device is standalone (alert on any offline).
     *
     */
    ha_group?: string;
});

