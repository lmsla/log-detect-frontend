/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SuccessResponse } from '../models/SuccessResponse';
import type { Target } from '../models/Target';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TargetManagementService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get All Targets
     * Retrieve all targets
     * @returns Target Targets retrieved
     * @throws ApiError
     */
    public getApiV1TargetGetAll(): CancelablePromise<Array<Target>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/Target/GetAll',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Create Target
     * Create a new target
     * @param requestBody
     * @returns Target Target created
     * @throws ApiError
     */
    public postApiV1TargetCreate(
        requestBody: Target,
    ): CancelablePromise<Target> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/Target/Create',
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
     * Update Target
     * Update target information
     * @param requestBody
     * @returns Target Target updated
     * @throws ApiError
     */
    public putApiV1TargetUpdate(
        requestBody: Target,
    ): CancelablePromise<Target> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/Target/Update',
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
     * Delete Target
     * Delete a target by ID
     * @param id Target ID
     * @returns SuccessResponse Target deleted
     * @throws ApiError
     */
    public deleteApiV1TargetDelete(
        id: number,
    ): CancelablePromise<SuccessResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/Target/Delete/{id}',
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
