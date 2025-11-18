/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';
import { AuthenticationService } from './services/AuthenticationService';
import { DeviceManagementService } from './services/DeviceManagementService';
import { ElasticsearchAlertsService } from './services/ElasticsearchAlertsService';
import { ElasticsearchMonitoringService } from './services/ElasticsearchMonitoringService';
import { EsConnectionManagementService } from './services/EsConnectionManagementService';
import { HistoryService } from './services/HistoryService';
import { IndicesManagementService } from './services/IndicesManagementService';
import { ReceiverManagementService } from './services/ReceiverManagementService';
import { SystemService } from './services/SystemService';
import { TargetManagementService } from './services/TargetManagementService';
import { UserManagementService } from './services/UserManagementService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class LogDetectApi {
    public readonly authentication: AuthenticationService;
    public readonly deviceManagement: DeviceManagementService;
    public readonly elasticsearchAlerts: ElasticsearchAlertsService;
    public readonly elasticsearchMonitoring: ElasticsearchMonitoringService;
    public readonly esConnectionManagement: EsConnectionManagementService;
    public readonly history: HistoryService;
    public readonly indicesManagement: IndicesManagementService;
    public readonly receiverManagement: ReceiverManagementService;
    public readonly system: SystemService;
    public readonly targetManagement: TargetManagementService;
    public readonly userManagement: UserManagementService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? 'http://localhost:8006',
            VERSION: config?.VERSION ?? '1.0.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.authentication = new AuthenticationService(this.request);
        this.deviceManagement = new DeviceManagementService(this.request);
        this.elasticsearchAlerts = new ElasticsearchAlertsService(this.request);
        this.elasticsearchMonitoring = new ElasticsearchMonitoringService(this.request);
        this.esConnectionManagement = new EsConnectionManagementService(this.request);
        this.history = new HistoryService(this.request);
        this.indicesManagement = new IndicesManagementService(this.request);
        this.receiverManagement = new ReceiverManagementService(this.request);
        this.system = new SystemService(this.request);
        this.targetManagement = new TargetManagementService(this.request);
        this.userManagement = new UserManagementService(this.request);
    }
}

