/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Receiver } from '../models/Receiver';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ReceiverManagementService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get All Receivers
     * Retrieve all receivers
     * @returns Receiver Receivers retrieved
     * @throws ApiError
     */
    public getApiV1ReceiverGetAll(): CancelablePromise<Array<Receiver>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/Receiver/GetAll',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Create Receiver
     * Create a new receiver
     * @param requestBody
     * @returns Receiver Receiver created
     * @throws ApiError
     */
    public postApiV1ReceiverCreate(
        requestBody: Receiver,
    ): CancelablePromise<Receiver> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/Receiver/Create',
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
     * Update Receiver
     * Update receiver information
     * @param requestBody
     * @returns Receiver Receiver updated
     * @throws ApiError
     */
    public putApiV1ReceiverUpdate(
        requestBody: Receiver,
    ): CancelablePromise<Receiver> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/Receiver/Update',
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
     * Delete Receiver
     * Delete a receiver by ID
     * @param id Receiver ID
     * @returns SuccessResponse Receiver deleted
     * @throws ApiError
     */
    public deleteApiV1ReceiverDelete(
        id: number,
    ): CancelablePromise<SuccessResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/Receiver/Delete/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
}
