/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonFields } from './CommonFields';
import type { Index } from './Index';
export type Target = (CommonFields & {
    /**
     * Target ID
     */
    id: number;
    /**
     * Email subject
     */
    subject: string;
    /**
     * Email recipients
     */
    to: Array<string>;
    /**
     * Whether target is enabled
     */
    enable: boolean;
    /**
     * Associated indices
     */
    indices?: Array<Index>;
});

