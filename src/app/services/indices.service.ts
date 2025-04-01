import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Indices } from '../models/target';

import { ConfirmDialogService } from './confirm-dialog.service';


const READ_ACTION = 'read';
const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';
const GET_INDICES = 'getall'

@Injectable()
export class IndicesService extends BehaviorSubject<Indices[]> {
  // ConfirmDialogService: any;
  constructor(private http: HttpClient) {
    super([]);
  }

  private data: Indices[] = [];
  private data1: any[] = [];

  // public read(reportID): void {
  //   this.fetch(null, reportID)
  //     .pipe(
  //       tap(data => {
  //         this.data = data;
  //         console.log("data",data)
  //       })
  //     )
  //     .subscribe(data => {
  //       super.next(data);
  //     });
  // }



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



  public getIndicesData(): Observable<any> {
    return this.http.get<any>(environment.apiDomain + '/api/v1/Indices/GetAll');
  }

  public save(data: Indices, isNew?: boolean): void {
    const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

    this.reset();
    console.log("save data",data.period)
    this.fetch(action, data)
      .subscribe(() => this.read(data), (e) => {
        alert(e.error);
      });
  }


  public save1(data: Indices, isNew?: boolean): void {
    const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

    this.reset();
    console.log("save data",data.period)
    this.fetch(action, data)
      .subscribe(() => this.readAllindices(), (e) => {
        alert(e.error);
      });
  }


  public remove(data: any): void {
    this.reset();

    this.fetch(REMOVE_ACTION, data).subscribe({
      next: () => {
        this.read(data);
      }, error: (e) => {
        alert(e.error);
      }
    });
  }


  public remove1(data: Indices): void {
    this.reset();

    this.fetch(REMOVE_ACTION, data)
      .subscribe(() => this.readAllindices(), (e) => {
        alert(e.error);
      });
  }

  public resetItem(dataItem: Indices): void {
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



  public getCurrentData() {
    return this.data;
  }

  private fetch(action = '', data?: Indices): Observable<Indices[]> {
    console.log("indices api",data);
    if (action == CREATE_ACTION) {
      return this.http
        .post(environment.apiDomain + "/api/v1/Indices/Create", data)
        .pipe(map(res => <Indices[]>res));
    }
    if (action == UPDATE_ACTION) {
      return this.http
        .put(environment.apiDomain + "/api/v1/Indices/Update", data)
        .pipe(map(res => <Indices[]>res));
    }
    if (action == REMOVE_ACTION) {
      return this.http
        .delete(environment.apiDomain + `/api/v1/Indices/Delete/${data.id}`)
        .pipe(map(res => <Indices[]>res));
    }
    if (action == GET_INDICES) {
      return this.http
      .get(environment.apiDomain + '/api/v1/Indices/GetAll')
      .pipe(map(res => <Indices[]>res));
    }
    return this.http
      .get(environment.apiDomain + `/api/v1/Indices/GetIndicesByTargetID/${data.target_id}`)
      .pipe(map(res => <Indices[]>res));
  }

}

