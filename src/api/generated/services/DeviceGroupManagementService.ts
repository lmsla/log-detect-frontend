/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeviceGroupCreate } from '../models/DeviceGroupCreate';
import type { DeviceGroupDetail } from '../models/DeviceGroupDetail';
import type { DeviceGroupWithCount } from '../models/DeviceGroupWithCount';
import type { MoveDevicesRequest } from '../models/MoveDevicesRequest';
import type { MoveDevicesResponse } from '../models/MoveDevicesResponse';
import type { MoveGroupDevicesRequest } from '../models/MoveGroupDevicesRequest';
import type { MoveGroupDevicesResponse } from '../models/MoveGroupDevicesResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DeviceGroupManagementService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create Device Group
     * Create a new device group
     * @param requestBody
     * @returns DeviceGroupDetail Device group created successfully
     * @throws ApiError
     */
    public postApiV1DeviceGroupCreate(
        requestBody: DeviceGroupCreate,
    ): CancelablePromise<DeviceGroupDetail> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/DeviceGroup/Create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request (e.g., group name already exists)`,
                401: `Unauthorized`,
                403: `Forbidden (insufficient permissions)`,
            },
        });
    }
    /**
     * Get All Device Groups
     * Get all device groups with device count statistics
     * @returns DeviceGroupWithCount Device groups retrieved
     * @throws ApiError
     */
    public getApiV1DeviceGroupGetAll(): CancelablePromise<Array<DeviceGroupWithCount>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/DeviceGroup/GetAll',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get Device Group by ID
     * Get a specific device group with device count
     * @param id Device group ID
     * @returns DeviceGroupWithCount Device group retrieved
     * @throws ApiError
     */
    public getApiV1DeviceGroupGet(
        id: number,
    ): CancelablePromise<DeviceGroupWithCount> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/DeviceGroup/Get/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request (invalid ID)`,
                401: `Unauthorized`,
                404: `Device group not found`,
            },
        });
    }
    /**
     * Update Device Group
     * Update an existing device group.
     *
     * **Required Fields**:
     * - `id` (integer): Device group ID to update
     * - `name` (string): Device group name
     *
     * **Optional Fields**:
     * - `description` (string): Device group description
     *
     * **Note**: The `id` and `name` fields are required to identify and update the group.
     *
     * @param requestBody
     * @returns DeviceGroupDetail Device group updated successfully
     * @throws ApiError
     */
    public putApiV1DeviceGroupUpdate(
        requestBody: DeviceGroupDetail,
    ): CancelablePromise<DeviceGroupDetail> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/DeviceGroup/Update',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request (e.g., group does not exist, missing required fields)`,
                401: `Unauthorized`,
                403: `Forbidden (insufficient permissions)`,
            },
        });
    }
    /**
     * Delete Device Group
     * Delete a device group (only allowed if group is empty)
     * @param id Device group ID
     * @returns any Device group deleted successfully
     * @throws ApiError
     */
    public deleteApiV1DeviceGroupDelete(
        id: number,
    ): CancelablePromise<{
        message?: string;
    }> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/DeviceGroup/Delete/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request (e.g., group still has devices)`,
                401: `Unauthorized`,
                403: `Forbidden (insufficient permissions)`,
            },
        });
    }
    /**
     * Move Devices to Another Group (Batch)
     * Move selected devices to another device group by device IDs.
     *
     * **Use Cases**:
     * - Move specific devices from multiple groups to a target group
     * - Reorganize devices across groups
     * - Prepare for deleting a group (move its devices first)
     *
     * **Required Fields**:
     * - `device_ids` (array of integers): List of device IDs to move
     * - `target_group_name` (string): Name of the target group
     *
     * @param requestBody
     * @returns MoveDevicesResponse Devices moved successfully
     * @throws ApiError
     */
    public postApiV1DeviceGroupMoveDevices(
        requestBody: MoveDevicesRequest,
    ): CancelablePromise<MoveDevicesResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/DeviceGroup/MoveDevices',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request (e.g., target group does not exist, empty device list)`,
                401: `Unauthorized`,
                403: `Forbidden (insufficient permissions)`,
            },
        });
    }
    /**
     * Move All Devices Between Groups
     * Move all devices from one group to another group.
     *
     * **Use Cases**:
     * - Merge two groups (move all devices from source to target)
     * - Prepare for deleting a group (move all devices first)
     * - Reorganize group structure
     *
     * **Required Fields**:
     * - `source_group_name` (string): Name of the source group
     * - `target_group_name` (string): Name of the target group
     *
     * **Note**: After this operation, the source group will be empty and can be deleted.
     *
     * @param requestBody
     * @returns MoveGroupDevicesResponse All devices moved successfully
     * @throws ApiError
     */
    public postApiV1DeviceGroupMoveGroupDevices(
        requestBody: MoveGroupDevicesRequest,
    ): CancelablePromise<MoveGroupDevicesResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/DeviceGroup/MoveGroupDevices',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request (e.g., group does not exist, same source and target)`,
                401: `Unauthorized`,
                403: `Forbidden (insufficient permissions)`,
            },
        });
    }
}
