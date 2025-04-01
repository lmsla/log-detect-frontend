import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http: HttpClient) { }


  // 取得history Data
  getHistoryData(logname: string): Observable<any> {
    return this.http.get<any>(environment.apiDomain + '/api/v1/History/GetData/' + logname);
  }
// 取得history 中的 logname check
  getLogNameData():Observable<any> {
    return this.http.get<any>(environment.apiDomain + '/api/v1/History/GetLognameData');
  }

}
