/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HistoryData } from '../models/HistoryData';
import type { LogNameData } from '../models/LogNameData';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class HistoryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get History Data
     * Get history data by logname
     * @param logname Log name
     * @returns HistoryData History data retrieved
     * @throws ApiError
     */
    public getApiV1HistoryGetData(
        logname: string,
    ): CancelablePromise<Array<HistoryData>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/History/GetData/{logname}',
            path: {
                'logname': logname,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get Log Name Data
     * Get log name data
     * @returns LogNameData Log name data retrieved
     * @throws ApiError
     */
    public getApiV1HistoryGetLognameData(): CancelablePromise<Array<LogNameData>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/History/GetLognameData',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
}
