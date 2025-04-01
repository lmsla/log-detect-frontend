import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BimapAppLayoutModule } from 'bimap-app-layout';
import { environment } from 'src/environments/environment';

// import { MessagesComponent } from './messages/messages.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DeviceComponent } from './pages/device/device.component';
import { ProgressBarModule } from '@progress/kendo-angular-progressbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuModule } from '@progress/kendo-angular-menu';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { IconsModule } from '@progress/kendo-angular-icons';
import { NotificationModule } from '@progress/kendo-angular-notification';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// <-- 執行 ng add @progress/kendo-angular-dateinputs 後自動import的
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { PopupModule } from '@progress/kendo-angular-popup';
import { LabelModule } from "@progress/kendo-angular-label";
import { DeviceListComponent } from './pages/device-list/device-list.component';
import { TargetsComponent } from "./pages/targets/targets.component";
import { DeviceService } from './services/device_list.service';
import { ConfirmDialogService } from './services/confirm-dialog.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TargetService } from './services/target.service';
import { IndicesService } from './services/indices.service';
import { TargetDetailService } from './services/target_detail.service';
import { TargetDialogTemplateComponent } from './shared/target-dialog-template/target-dialog-template.component';
import { TargetDetailComponent } from './pages/target-detail/target-detail.component';
import { ConfirmDialogComponent } from './pages/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LogdetailComponent } from './pages/logdetail/logdetail.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';
import { PagerModule } from '@progress/kendo-angular-pager';
import { LogManagementComponent } from './pages/log-management/log-management.component';









@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DeviceComponent,
    DeviceListComponent,
    TargetsComponent,
    TargetDialogTemplateComponent,
    TargetDetailComponent,
    ConfirmDialogComponent,
    LogdetailComponent,
    DashboardComponent,
    LogManagementComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BimapAppLayoutModule.forRoot({
      clientId: environment.clientId,
      version: environment.version,
      display_title: environment.display_title,
      apiDomain: environment.apiDomain,
    }),
    HttpClientModule,
    DateInputsModule,
    BrowserAnimationsModule,
    GridModule,
    DropDownsModule,
    DialogsModule,
    IconsModule,
    NotificationModule,
    MenuModule,
    ButtonsModule,
    LayoutModule,
    PopupModule,
    ProgressBarModule,
    ReactiveFormsModule,
    LabelModule,
    NotificationModule,
    HttpClientModule,
    MatDialogModule,
    ChartsModule,
    PagerModule,
  ],
  providers: [
    {
      deps: [HttpClient],
      provide: DeviceService,
      useFactory: (json: HttpClient) => () => new DeviceService(json),
    },
    {
      deps: [HttpClient],
      provide: TargetService,
      useFactory: (json: HttpClient) => () => new TargetService(json),
    },
    {
      deps: [HttpClient],
      provide: IndicesService,
      useFactory: (json: HttpClient) => () => new IndicesService(json),
    },
    {
      deps: [HttpClient],
      provide: TargetDetailService,
      useFactory: (json: HttpClient) => () => new TargetDetailService(json),
    },
    ConfirmDialogService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
