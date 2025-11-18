/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ESMetricTimeSeries = {
    /**
     * Timestamp (ISO 8601)
     */
    time?: string;
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
     * 響應時間（單位：毫秒）
     */
    response_time?: number;
    /**
     * 索引速率（每秒文檔數）
     */
    indexing_rate?: number;
    /**
     * 搜尋速率（每秒查詢數）
     */
    search_rate?: number;
    /**
     * Active shards count
     */
    active_shards?: number;
    /**
     * Unassigned shards count
     */
    unassigned_shards?: number;
};

