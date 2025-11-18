/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SuccessResponse } from '../models/SuccessResponse';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class UserManagementService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List Users
     * Get all users (Admin only)
     * @returns User Users retrieved
     * @throws ApiError
     */
    public getApiV1AuthUsers(): CancelablePromise<Array<User>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/auth/users',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Get User by ID
     * Get user by ID
     * @param id User ID
     * @returns User User retrieved
     * @throws ApiError
     */
    public getApiV1AuthUsers1(
        id: number,
    ): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/auth/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `User not found`,
            },
        });
    }
    /**
     * Update User
     * Update user information
     * @param id User ID
     * @param requestBody
     * @returns User User updated
     * @throws ApiError
     */
    public putApiV1AuthUsers(
        id: number,
        requestBody: User,
    ): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/auth/users/{id}',
            path: {
                'id': id,
            },
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
     * Delete User
     * Delete user (Admin only)
     * @param id User ID
     * @returns SuccessResponse User deleted
     * @throws ApiError
     */
    public deleteApiV1AuthUsers(
        id: number,
    ): CancelablePromise<SuccessResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/auth/users/{id}',
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
