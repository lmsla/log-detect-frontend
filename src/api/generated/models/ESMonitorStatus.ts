/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ESMonitorStatus = {
    /**
     * Monitor ID
     */
    monitor_id?: number;
    /**
     * Monitor name
     */
    monitor_name?: string;
    /**
     * Host and port
     */
    host?: string;
    /**
     * Monitor status
     */
    status?: ESMonitorStatus.status;
    /**
     * Cluster health status
     */
    cluster_status?: ESMonitorStatus.cluster_status;
    /**
     * Cluster name
     */
    cluster_name?: string;
    /**
     * 響應時間（單位：毫秒）
     */
    response_time?: number;
    /**
     * CPU 使用率（單位：百分比 0-100）
     */
    cpu_usage?: number;
    /**
     * 記憶體使用率（單位：百分比 0-100）
     */
    memory_usage?: number;
    /**
     * 磁碟使用率（單位：百分比 0-100）
     */
    disk_usage?: number;
    /**
     * Number of nodes
     */
    node_count?: number;
    /**
     * Number of active shards
     */
    active_shards?: number;
    /**
     * Number of unassigned shards
     */
    unassigned_shards?: number;
    /**
     * 最後檢查時間（ISO 8601 格式）
     */
    last_check_time?: string;
    /**
     * Error message if any
     */
    error_message?: string;
    /**
     * Warning message if any
     */
    warning_message?: string;
};
export namespace ESMonitorStatus {
    /**
     * Monitor status
     */
    export enum status {
        ONLINE = 'online',
        OFFLINE = 'offline',
        WARNING = 'warning',
        ERROR = 'error',
    }
    /**
     * Cluster health status
     */
    export enum cluster_status {
        GREEN = 'green',
        YELLOW = 'yellow',
        RED = 'red',
    }
}

