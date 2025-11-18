/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ESAlert = {
    /**
     * Alert ID (auto-generated in TimescaleDB based on time)
     */
    id?: number;
    /**
     * Alert creation time (ISO 8601)
     */
    time?: string;
    /**
     * Monitor ID that triggered this alert
     */
    monitor_id?: number;
    /**
     * Monitor name (joined from monitors table)
     */
    monitor_name?: string;
    /**
     * Type of alert
     */
    alert_type?: ESAlert.alert_type;
    /**
     * Alert severity level
     */
    severity?: ESAlert.severity;
    /**
     * Alert message
     */
    message?: string;
    /**
     * Alert status
     */
    status?: ESAlert.status;
    /**
     * Time when alert was resolved (ISO 8601)
     */
    resolved_at?: string | null;
    /**
     * Note about how the alert was resolved
     */
    resolution_note?: string | null;
    /**
     * Who acknowledged the alert
     */
    acknowledged_by?: string | null;
    /**
     * When the alert was acknowledged (ISO 8601)
     */
    acknowledged_at?: string | null;
    /**
     * Note added when acknowledging
     */
    acknowledgement_note?: string | null;
};
export namespace ESAlert {
    /**
     * Type of alert
     */
    export enum alert_type {
        HEALTH = 'health',
        PERFORMANCE = 'performance',
        CAPACITY = 'capacity',
        AVAILABILITY = 'availability',
    }
    /**
     * Alert severity level
     */
    export enum severity {
        CRITICAL = 'critical',
        HIGH = 'high',
        MEDIUM = 'medium',
        LOW = 'low',
    }
    /**
     * Alert status
     */
    export enum status {
        ACTIVE = 'active',
        RESOLVED = 'resolved',
        ACKNOWLEDGED = 'acknowledged',
    }
}

