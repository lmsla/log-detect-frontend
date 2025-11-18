/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequest } from '../models/LoginRequest';
import type { LoginResponse } from '../models/LoginResponse';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthenticationService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * User Login
     * Authenticate user and return JWT token
     * @param requestBody
     * @returns LoginResponse Login successful
     * @throws ApiError
     */
    public postAuthLogin(
        requestBody: LoginRequest,
    ): CancelablePromise<LoginResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Register User
     * Create a new user account (Admin only)
     * @param requestBody
     * @returns User User created successfully
     * @throws ApiError
     */
    public postApiV1AuthRegister(
        requestBody: User,
    ): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/auth/register',
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
     * Get Current User Profile
     * Get current authenticated user's profile
     * @returns User User profile retrieved
     * @throws ApiError
     */
    public getApiV1AuthProfile(): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/auth/profile',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Refresh Token
     * Refresh JWT token
     * @returns LoginResponse Token refreshed
     * @throws ApiError
     */
    public postApiV1AuthRefresh(): CancelablePromise<LoginResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/auth/refresh',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
}
