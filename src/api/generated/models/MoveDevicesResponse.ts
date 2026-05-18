/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MoveDevicesResponse = {
    /**
     * Number of devices successfully moved
     */
    moved_count?: number;
    /**
     * Name of the target group
     */
    target_group_name?: string;
    /**
     * List of device IDs that were moved
     */
    device_ids?: Array<number>;
};

