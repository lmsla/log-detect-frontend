/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ElasticsearchMonitor } from '../models/ElasticsearchMonitor';
import type { ESMetricTimeSeries } from '../models/ESMetricTimeSeries';
import type { ESMonitorStatus } from '../models/ESMonitorStatus';
import type { ESStatistics } from '../models/ESStatistics';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ElasticsearchMonitoringService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get All ES Monitors
     * Retrieve all Elasticsearch monitoring configurations
     * @returns any ES monitors retrieved successfully
     * @throws ApiError
     */
    public getApiV1ElasticsearchMonitors(): CancelablePromise<{
        success?: boolean;
        msg?: string;
        body?: Array<ElasticsearchMonitor>;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/elasticsearch/monitors',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Create ES Monitor
     * Create a new Elasticsearch monitoring configuration
     * @param requestBody
     * @returns any ES monitor created successfully
     * @throws ApiError
     */
    public postApiV1ElasticsearchMonitors(
        requestBody: ElasticsearchMonitor,
    ): CancelablePromise<{
        success?: boolean;
        msg?: string;
        body?: ElasticsearchMonitor;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/elasticsearch/monitors',
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
     * Update ES Monitor
     * Update an existing Elasticsearch monitoring configuration
     * @param requestBody
     * @returns any ES monitor updated successfully
     * @throws ApiError
     */
    public putApiV1ElasticsearchMonitors(
        requestBody: ElasticsearchMonitor,
    ): CancelablePromise<{
        success?: boolean;
        msg?: string;
        body?: ElasticsearchMonitor;
    }> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/elasticsearch/monitors',
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
     * Get ES Monitor by ID
     * Retrieve a specific Elasticsearch monitoring configuration by ID
     * @param id Monitor ID
     * @returns any ES monitor retrieved successfully
     * @throws ApiError
     */
    public getApiV1ElasticsearchMonitors1(
        id: number,
    ): CancelablePromise<{
        success?: boolean;
        msg?: string;
        body?: ElasticsearchMonitor;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/elasticsearch/monitors/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Delete ES Monitor
     * Delete an Elasticsearch monitoring configuration
     * @param id Monitor ID
     * @returns SuccessResponse ES monitor deleted successfully
     * @throws ApiError
     */
    public deleteApiV1ElasticsearchMonitors(
        id: number,
    ): CancelablePromise<SuccessResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/elasticsearch/monitors/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Toggle ES Monitor
     * Enable or disable an Elasticsearch monitoring configuration
     * @param id Monitor ID
     * @param requestBody
     * @returns SuccessResponse Monitor toggled successfully
     * @throws ApiError
     */
    public postApiV1ElasticsearchMonitorsToggle(
        id: number,
        requestBody: {
            enable: boolean;
        },
    ): CancelablePromise<SuccessResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/elasticsearch/monitors/{id}/toggle',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Get All ES Monitors Status
     * Retrieve current status of all Elasticsearch monitors
     * @returns any Status retrieved successfully
     * @throws ApiError
     */
    public getApiV1ElasticsearchStatus(): CancelablePromise<{
        success?: boolean;
        msg?: string;
        body?: Array<ESMonitorStatus>;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/elasticsearch/status',
            errors: {
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get ES Monitor History
     * Retrieve historical metrics for a specific Elasticsearch monitor
     * @param id Monitor ID
     * @param hours Hours to query (default 24, max 720)
     * @param interval Time bucket interval (auto-selected if not specified)
     * @returns any History retrieved successfully
     * @throws ApiError
     */
    public getApiV1ElasticsearchStatusHistory(
        id: number,
        hours: number = 24,
        interval?: '1 minute' | '5 minutes' | '10 minutes' | '1 hour',
    ): CancelablePromise<{
        success?: boolean;
        msg?: string;
        body?: {
            monitor_id?: number;
            start_time?: string;
            end_time?: string;
            interval?: string;
            data?: Array<ESMetricTimeSeries>;
        };
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/elasticsearch/status/{id}/history',
            path: {
                'id': id,
            },
            query: {
                'hours': hours,
                'interval': interval,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get ES Statistics
     * Retrieve overall Elasticsearch monitoring statistics
     * @returns any Statistics retrieved successfully
     * @throws ApiError
     */
    public getApiV1ElasticsearchStatistics(): CancelablePromise<{
        success?: boolean;
        msg?: string;
        body?: ESStatistics;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/elasticsearch/statistics',
            errors: {
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
}
