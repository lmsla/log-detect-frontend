/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Device } from '../models/Device';
import type { DeviceCount } from '../models/DeviceCount';
import type { DeviceGroup } from '../models/DeviceGroup';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DeviceManagementService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get All Devices
     * Retrieve all devices
     * @returns Device Devices retrieved
     * @throws ApiError
     */
    public getApiV1DeviceGetAll(): CancelablePromise<Array<Device>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/Device/GetAll',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Create Device
     * Create a new device
     * @param requestBody
     * @returns Device Device created
     * @throws ApiError
     */
    public postApiV1DeviceCreate(
        requestBody: Array<Device>,
    ): CancelablePromise<Array<Device>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/Device/Create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Update Device
     * Update device information
     * @param requestBody
     * @returns Device Device updated
     * @throws ApiError
     */
    public putApiV1DeviceUpdate(
        requestBody: Device,
    ): CancelablePromise<Device> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/Device/Update',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Delete Device
     * Delete a device by ID
     * @param id Device ID
     * @returns SuccessResponse Device deleted
     * @throws ApiError
     */
    public deleteApiV1DeviceDelete(
        id: number,
    ): CancelablePromise<SuccessResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/Device/Delete/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Get Device Counts
     * Get device count by group
     * @returns DeviceCount Device counts retrieved
     * @throws ApiError
     */
    public getApiV1DeviceCount(): CancelablePromise<Array<DeviceCount>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/Device/count',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get Device Groups
     * Get all device groups
     * @returns DeviceGroup Device groups retrieved
     * @throws ApiError
     */
    public getApiV1DeviceGetGroup(): CancelablePromise<Array<DeviceGroup>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/Device/GetGroup',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
}
