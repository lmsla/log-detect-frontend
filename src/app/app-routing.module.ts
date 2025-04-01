
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DeviceComponent } from './pages/device/device.component';
import { DeviceListComponent } from './pages/device-list/device-list.component';
import { TargetsComponent } from './pages/targets/targets.component';
import { LogdetailComponent } from './pages/logdetail/logdetail.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LogManagementComponent } from './pages/log-management/log-management.component';



const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: "home", component: HomeComponent },
  // { path: 'device', component: DeviceComponent },

  {
    path: 'device',
    component: DeviceComponent,
    // children: [
    //   { path: 'dashboard', component: DashboardComponent }
    // ]
  },
  { path: "device_list", component: DeviceListComponent },
  { path: "target", component: TargetsComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "indices",component: LogManagementComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
