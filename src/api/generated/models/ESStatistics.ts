/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ESStatistics = {
    /**
     * Total number of monitors
     */
    total_monitors?: number;
    /**
     * Number of online monitors
     */
    online_monitors?: number;
    /**
     * Number of offline monitors
     */
    offline_monitors?: number;
    /**
     * Number of monitors with warnings
     */
    warning_monitors?: number;
    /**
     * Total nodes across all clusters
     */
    total_nodes?: number;
    /**
     * Total indices across all clusters
     */
    total_indices?: number;
    /**
     * Total documents across all clusters
     */
    total_documents?: number;
    /**
     * Total size in GB
     */
    total_size_gb?: number;
    /**
     * 平均響應時間（單位：毫秒）
     */
    avg_response_time?: number;
    /**
     * 平均 CPU 使用率（單位：百分比 0-100）
     */
    avg_cpu_usage?: number;
    /**
     * 平均記憶體使用率（單位：百分比 0-100）
     */
    avg_memory_usage?: number;
    /**
     * Number of active alerts
     */
    active_alerts?: number;
    /**
     * Last update time
     */
    last_update_time?: string;
};

