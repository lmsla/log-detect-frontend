import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject,map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeviceGroup } from '../models/target';
import { Logname } from '../models/target';



@Injectable({
  providedIn: 'root',
})
export class DropdownService extends BehaviorSubject<DeviceGroup[]> {
  constructor(private http: HttpClient) {
    super([]);
  }
  private data: any[] = [];
  public getGroup() {
    return this.http
      .get(environment.apiDomain + `/api/v1/Device/GetGroup`).pipe(map(res => <DeviceGroup[]>res));
  }

  public getlogname() {
    return this.http
      .get(environment.apiDomain + `/api/v1/Indices/GetLogname`).pipe(map(res => <Logname[]>res));
  }

  public getCurrentData() {
    return this.data;
  }





  // public async get() {
  //   try {
  //     const res = await this.http.get(environment.apiDomain + `/api/v1/Device/count`).toPromise();
  //     return res as DeviceGroup[];
  //   } catch (error) {
  //     // 處理錯誤
  //     console.error('Error while fetching device groups:', error);
  //     throw error;
  //   }
  // }

}
