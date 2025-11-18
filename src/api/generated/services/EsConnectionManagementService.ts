/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ESConnection } from '../models/ESConnection';
import type { ESConnectionSummary } from '../models/ESConnectionSummary';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class EsConnectionManagementService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get All ES Connections
     * Retrieve all Elasticsearch connection configurations
     * @returns ESConnectionSummary ES connections retrieved successfully
     * @throws ApiError
     */
    public getApiV1EsConnectionGetAll(): CancelablePromise<Array<ESConnectionSummary>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/ESConnection/GetAll',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Get ES Connection
     * Retrieve a specific ES connection by ID
     * @param id ES Connection ID
     * @returns ESConnectionSummary ES connection retrieved successfully
     * @throws ApiError
     */
    public getApiV1EsConnectionGet(
        id: number,
    ): CancelablePromise<ESConnectionSummary> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/ESConnection/Get/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `ES connection not found`,
            },
        });
    }
    /**
     * Create ES Connection
     * Create a new Elasticsearch connection configuration
     * @param requestBody
     * @returns ESConnectionSummary ES connection created successfully
     * @throws ApiError
     */
    public postApiV1EsConnectionCreate(
        requestBody: ESConnection,
    ): CancelablePromise<ESConnectionSummary> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/ESConnection/Create',
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
     * Update ES Connection
     * Update an existing ES connection configuration
     * @param requestBody
     * @returns ESConnectionSummary ES connection updated successfully
     * @throws ApiError
     */
    public putApiV1EsConnectionUpdate(
        requestBody: ESConnection,
    ): CancelablePromise<ESConnectionSummary> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/ESConnection/Update',
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
     * Delete ES Connection
     * Delete an ES connection configuration (soft delete)
     * @param id ES Connection ID
     * @returns SuccessResponse ES connection deleted successfully
     * @throws ApiError
     */
    public deleteApiV1EsConnectionDelete(
        id: number,
    ): CancelablePromise<SuccessResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/ESConnection/Delete/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Cannot delete - connection is in use`,
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Test ES Connection
     * Test an ES connection without saving it to database
     * @param requestBody
     * @returns any Connection test successful
     * @throws ApiError
     */
    public postApiV1EsConnectionTest(
        requestBody: ESConnection,
    ): CancelablePromise<{
        status?: string;
        url?: string;
        response?: string;
        enable_auth?: boolean;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/ESConnection/Test',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Connection test failed`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Set Default ES Connection
     * Set a specific ES connection as the default connection
     * @param id ES Connection ID
     * @returns SuccessResponse Default ES connection set successfully
     * @throws ApiError
     */
    public putApiV1EsConnectionSetDefault(
        id: number,
    ): CancelablePromise<SuccessResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/ESConnection/SetDefault/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `ES connection not found`,
            },
        });
    }
    /**
     * Reload ES Connection
     * Reload a specific ES connection in the connection manager
     * @param id ES Connection ID
     * @returns SuccessResponse ES connection reloaded successfully
     * @throws ApiError
     */
    public putApiV1EsConnectionReload(
        id: number,
    ): CancelablePromise<SuccessResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/ESConnection/Reload/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `ES connection not found`,
            },
        });
    }
    /**
     * Reload All ES Connections
     * Reload all ES connections in the connection manager
     * @returns SuccessResponse All ES connections reloaded successfully
     * @throws ApiError
     */
    public putApiV1EsConnectionReloadAll(): CancelablePromise<SuccessResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/ESConnection/ReloadAll',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
}
