import { Injectable } from '@angular/core';
import { Observable, of, tap, map, catchError, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Targets } from '../models/target';
import { Indices } from '../models/target';
import { Index } from '../models/target';
import { DataResult, orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { MessageService } from '../message.service';


const READ_ACTION = 'read';
const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';
const GET_INDICES = 'getall'
const GET_INDICES_BY_ID = 'getindices'


@Injectable()
export class TargetDetailService extends BehaviorSubject<any[]> {
  constructor(private http: HttpClient) {
    super([]);
  }

  private data: any[] = [];


  public getAllIndices() {
    return this.http
      .get(environment.apiDomain + `/api/v1/Indices/GetAll`)
      .pipe(map(res => <Index[]>res));
  }

  public getCurrentData() {
    return this.data;
  }

  public read(data: any): void {

    this.fetch(READ_ACTION, data)
      .pipe(
        tap(data => {
          this.data = data;
        })
      )
      .subscribe(data => {
        super.next(data);
      });
  }

  public save(data: any, isNew?: boolean): void {
    const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

    this.reset();

    this.fetch(action, data).subscribe({
      next: () => {
        this.read(data);
      }, error: (e) => {
        alert(e.error);
      }
    });
  }

  // 測試頁
  public readAllindices(): void {
    if (this.data.length) {
      return super.next(this.data);
    }

    this.fetch(GET_INDICES)
      .pipe(
        tap(data => {
          this.data = data;
        })
      )
      .subscribe(data => {
        super.next(data);
      });
  }



  public readIndicesbytargetID(): void {
    if (this.data.length) {
      return super.next(this.data);
    }
    console.log("readIndicesbytargetID datas", this.data)
    this.fetch(GET_INDICES_BY_ID)
      .pipe(
        tap(data => {
          this.data = data;
        })
      )
      .subscribe(data => {
        super.next(data);
      });

      console.log("readIndicesbytargetID datas1", this.data)
  }


  public remove1(data: any): void {
    this.reset();
    console.log("remove datas", data)
    this.fetch(REMOVE_ACTION, data)
      .subscribe(() => this.readAllindices(), (e) => {
        alert(e.error);
      });
  }

  /// 執行刪除動作後讀取當前 target 下的 indices;
  public remove(data: any): void {
    this.reset();
    console.log("remove data", data)
    this.fetch(REMOVE_ACTION, data).subscribe({
      next: () => {
        this.read(data);
      }, error: (e) => {
        alert(e.error);
      }
    });
  }


  public resetItem(dataItem: any): void {
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

  private fetch(action = '', data?: any): Observable<any[]> {
    console.log("target_details api", data);
    console.log("action", action);
    if (action == CREATE_ACTION) {
      return this.http
        .put(environment.apiDomain + "/api/v1/Target/Update", data)
        .pipe(map(res => <any[]>res));
    }
    if (action == UPDATE_ACTION) {
      console.log("UPDATE_ACTION api", data);
      return this.http
        .put(environment.apiDomain + "/api/v1/Target/Update", data)
        .pipe(map(res => <any[]>res));
    }
    if (action == REMOVE_ACTION) {
      console.log("REMOVE_ACTION api", data);
      return this.http
        .put(environment.apiDomain + "/api/v1/Target/Update", data)
        .pipe(map(res => <any[]>res));
    }
    if (action == GET_INDICES) {
      console.log("GET_INDICES api", data);
      return this.http
        .get(environment.apiDomain + '/api/v1/Indices/GetAll')
        .pipe(map(res => <Indices[]>res));
    }
    if (action == GET_INDICES_BY_ID) {
      console.log("GET_INDICES_BY_ID api", data);
      return this.http
        .get(environment.apiDomain + `/api/v1/Indices/GetIndicesByTargetID/${data.id}`)
        .pipe(map(res => <Indices[]>res));
    }

    return this.http
    .get(environment.apiDomain + `/api/v1/Indices/GetIndicesByTargetID/${data.id}`)
    .pipe(map(res => <Indices[]>res));
  }

}
