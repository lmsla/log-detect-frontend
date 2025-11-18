/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SystemService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Health Check
     * Check if the service is running
     * @returns any Service is healthy
     * @throws ApiError
     */
    public getHealthcheck(): CancelablePromise<{
        status?: string;
        message?: string;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/healthcheck',
        });
    }
}
