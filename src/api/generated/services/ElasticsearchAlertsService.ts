/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ESAlert } from '../models/ESAlert';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ElasticsearchAlertsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get ES Alerts
     * Retrieve Elasticsearch monitoring alerts with filtering and pagination
     * @param monitorId Filter by monitor ID
     * @param status Filter by alert status (can specify multiple)
     * @param severity Filter by severity level (can specify multiple)
     * @param alertType Filter by alert type (can specify multiple)
     * @param start Start time for time range filter (ISO 8601)
     * @param end End time for time range filter (ISO 8601)
     * @param page Page number for pagination
     * @param pageSize Number of items per page
     * @returns any Alerts retrieved successfully
     * @throws ApiError
     */
    public getApiV1ElasticsearchAlerts(
        monitorId?: number,
        status?: Array<'active' | 'resolved'>,
        severity?: Array<'critical' | 'high' | 'medium' | 'low'>,
        alertType?: Array<'health' | 'performance' | 'capacity' | 'availability'>,
        start?: string,
        end?: string,
        page: number = 1,
        pageSize: number = 20,
    ): CancelablePromise<{
        success?: boolean;
        msg?: string;
        body?: {
            /**
             * Total number of alerts matching filters
             */
            total?: number;
            /**
             * Current page number
             */
            page?: number;
            /**
             * Number of items per page
             */
            page_size?: number;
            data?: Array<ESAlert>;
        };
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/elasticsearch/alerts',
            query: {
                'monitor_id': monitorId,
                'status': status,
                'severity': severity,
                'alert_type': alertType,
                'start': start,
                'end': end,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get ES Alert by ID
     * Retrieve detailed information for a specific alert
     * @param id Alert ID
     * @returns any Alert retrieved successfully
     * @throws ApiError
     */
    public getApiV1ElasticsearchAlerts1(
        id: number,
    ): CancelablePromise<{
        success?: boolean;
        msg?: string;
        body?: ESAlert;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/elasticsearch/alerts/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                404: `Alert not found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Resolve ES Alert
     * Mark an alert as resolved with optional resolution note
     * @param id Alert ID
     * @param requestBody
     * @returns any Alert resolved successfully
     * @throws ApiError
     */
    public postApiV1ElasticsearchAlertsResolve(
        id: number,
        requestBody?: {
            /**
             * Optional note about the resolution
             */
            resolution_note?: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        msg?: string;
        body?: ESAlert;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/elasticsearch/alerts/{id}/resolve',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Alert not found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Acknowledge ES Alert
     * Acknowledge an alert to indicate it has been seen and is being handled
     * @param id Alert ID
     * @param requestBody
     * @returns any Alert acknowledged successfully
     * @throws ApiError
     */
    public putApiV1ElasticsearchAlertsAcknowledge(
        id: number,
        requestBody?: {
            /**
             * Name or ID of the person acknowledging
             */
            acknowledged_by?: string;
            /**
             * Optional acknowledgement note
             */
            note?: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        msg?: string;
        body?: ESAlert;
    }> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/elasticsearch/alerts/{id}/acknowledge',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Alert not found`,
                500: `Internal Server Error`,
            },
        });
    }
}
