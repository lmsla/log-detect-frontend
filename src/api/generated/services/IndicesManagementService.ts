/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Index } from '../models/Index';
import type { LogName } from '../models/LogName';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class IndicesManagementService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get All Indices
     * Retrieve all indices
     * @returns Index Indices retrieved
     * @throws ApiError
     */
    public getApiV1IndicesGetAll(): CancelablePromise<Array<Index>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/Indices/GetAll',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Create Index
     * Create a new index
     * @param requestBody
     * @returns Index Index created
     * @throws ApiError
     */
    public postApiV1IndicesCreate(
        requestBody: Index,
    ): CancelablePromise<Index> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/Indices/Create',
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
     * Update Index
     * Update index information
     * @param requestBody
     * @returns Index Index updated
     * @throws ApiError
     */
    public putApiV1IndicesUpdate(
        requestBody: Index,
    ): CancelablePromise<Index> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/Indices/Update',
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
     * Delete Index
     * Delete an index by ID
     * @param id Index ID
     * @returns SuccessResponse Index deleted
     * @throws ApiError
     */
    public deleteApiV1IndicesDelete(
        id: number,
    ): CancelablePromise<SuccessResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/Indices/Delete/{id}',
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
     * Get Indices by Logname
     * Get indices by logname
     * @param logname Log name
     * @returns Index Indices retrieved
     * @throws ApiError
     */
    public getApiV1IndicesGetIndicesByLogname(
        logname: string,
    ): CancelablePromise<Array<Index>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/Indices/GetIndicesByLogname/{logname}',
            path: {
                'logname': logname,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get Indices by Target ID
     * Get indices by target ID
     * @param id Target ID
     * @returns Index Indices retrieved
     * @throws ApiError
     */
    public getApiV1IndicesGetIndicesByTargetId(
        id: number,
    ): CancelablePromise<Array<Index>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/Indices/GetIndicesByTargetID/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get Log Names
     * Get all log names
     * @returns LogName Log names retrieved
     * @throws ApiError
     */
    public getApiV1IndicesGetLogname(): CancelablePromise<Array<LogName>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/Indices/GetLogname',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
}
