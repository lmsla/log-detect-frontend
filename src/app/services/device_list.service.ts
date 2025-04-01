import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Device } from '../models/device_count';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';


@Injectable()
export class DeviceService extends BehaviorSubject<Device[]> {
  constructor(private http: HttpClient) {
    super([]);
  }

  private data: Device[] = [];

  public getall() {
    return this.http
      .get(environment.apiDomain + `/api/v1/Device/GetAll`).pipe(
        map((x: any) => {
          return x;
        })
      );
  }



  public staticRead() {
    return this.http
      .get(environment.apiDomain + `/api/v1/Device/GetAll`)
      .pipe(map(res => <Device[]>res));
  }

  public read(): void {
    if (this.data.length) {
      return super.next(this.data);
    }

    this.fetch()
      .pipe(
        tap(data => {
          this.data = data;
        })
      )
      .subscribe(data => {
        super.next(data);
      });
  }

  public save(data: Device, isNew?: boolean): void {
    const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

    this.reset();

    this.fetch(action, data)
      .subscribe(() => this.read(), (e) => {
        alert(e.error);
        this.read();
      });
  }

  public remove(data: Device): void {
    this.reset();

    this.fetch(REMOVE_ACTION, data)
      .subscribe(() => this.read(), (e) => {
        alert(e.error);
        this.read();
      });
  }

  public resetItem(dataItem: Device): void {
    if (!dataItem) { return; }

    // find orignal data item
    const originalDataItem = this.data.find(item => item.id === dataItem.id);

    // revert changes
    Object.assign(originalDataItem, dataItem);

    super.next(this.data);
  }

  private reset() {
    this.data = [];
  }

  private fetch(action = '', data?: Device): Observable<Device[]> {
    if (action == CREATE_ACTION) {
      return this.http
      // 因為後端接收的是 array 包起來的 device 格式，所以這邊的 data 也要用 [] 包
        .post(environment.apiDomain + "/api/v1/Device/Create", [data])
        .pipe(map(res => <Device[]>res));
    }
    if (action == UPDATE_ACTION) {
      return this.http
        .put(environment.apiDomain + "/api/v1/Device/Update", data)
        .pipe(map(res => <Device[]>res));
    }
    if (action == REMOVE_ACTION) {
      return this.http
        .delete(environment.apiDomain + `/api/v1/Device/Delete/${data.id}`)
        .pipe(map(res => <Device[]>res));
    }
    return this.http
      .get(environment.apiDomain + "/api/v1/Device/GetAll")
      .pipe(map(res => <Device[]>res));
  }

}
