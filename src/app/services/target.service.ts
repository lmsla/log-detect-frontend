import { Injectable } from '@angular/core';
import { Observable, of, tap,map ,catchError,BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Targets } from '../models/target';
import { DataResult, orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { MessageService } from '../message.service';


const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

@Injectable()
export class TargetService extends BehaviorSubject<Targets[]> {
  constructor(private http: HttpClient) {
    super([]);
  }

  private data: Targets[] = [];



  public read(): void {

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

  public save(data: Targets, isNew?: boolean): void {
    const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

    this.reset();

    this.fetch(action, data)
      .subscribe(() => this.read(), (e) => {
        alert(e.error);
        this.read();
      });
  }

  public remove(data: Targets): void {
    this.reset();

    this.fetch(REMOVE_ACTION, data)
      .subscribe(() => this.read(), (e) => {
        alert(e.error);
        this.read();
      });
  }

  public resetItem(dataItem: Targets): void {
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

  private fetch(action = '', data?: Targets): Observable<Targets[]> {
    if (action == CREATE_ACTION) {
      return this.http
        .post(environment.apiDomain + "/api/v1/Target/Create", data)
        .pipe(map(res => <Targets[]>res));
    }
    if (action == UPDATE_ACTION) {
      console.log(data);
      return this.http
        .put(environment.apiDomain + "/api/v1/Target/Update", data)
        .pipe(map(res => <Targets[]>res));
    }
    if (action == REMOVE_ACTION) {
      return this.http
        .delete(environment.apiDomain + `/api/v1/Target/Delete/${data.id}`)
        .pipe(map(res => <Targets[]>res));
    }
    return this.http
      .get(environment.apiDomain + "/api/v1/Target/GetAll")
      .pipe(map(res => <Targets[]>res));
  }

}





// @Injectable({
//   providedIn: 'root'
// })
// export class TargetService {
//   constructor(
//     private http: HttpClient,
//     private messageService: MessageService) { }

//   private GetTargetUrl = environment.apiDomain + '/api/v1/Target/GetAll';
//   private CreateTargetUrl = environment.apiDomain + '/api/v1/Target/Create';
//   public DeleteTargetUrl = environment.apiDomain + '/api/v1/Target/Delete';
//   private UpdateTargetUrl = environment.apiDomain + '/api/v1/Target/Update';


//   httpOptions = {
//     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
//   };

//   public getTargets(): Observable<Targets[]> {
//     return this.http.get<Targets[]>(this.GetTargetUrl).pipe(catchError(this.handleError<Targets[]>('get targets', [])))

//   }





//   public getTarget(
//     targets: Targets[],
//     skip: number,
//     pageSize: number,
//     sortDescriptor: SortDescriptor[],
//     filterTerm: number | null
//   ): Observable<DataResult> {
//     let data;

//     if (filterTerm) {
//       data = process(orderBy(targets, sortDescriptor), {
//         filter: {
//           logic: 'and',
//           filters: [
//             {
//               field: 'id',
//               operator: 'eq',
//               value: filterTerm
//             }
//           ]
//         }
//       }).data;
//     } else {
//       data = orderBy(targets, sortDescriptor);
//     }
//     return of({
//       data: data.slice(skip, skip + pageSize),
//       total: data.length
//     });
//   }


//   private handleError<T>(operation = 'operation', result?: T) {
//     return (error: any): Observable<T> => {

//       // TODO: send the error to remote logging infrastructure
//       console.error(error); // log to console instead

//       // TODO: better job of transforming error for user consumption
//       this.log(`${operation} failed: ${error.message}`);

//       // Let the app keep running by returning an empty result.
//       return of(result as T);
//     };
//   }

//   /** Log a HeroService message with the MessageService */
//   private log(message: string) {
//     this.messageService.add(`Target Service: ${message}`);
//   }

//   /** POST: add a new hero to the server */
//   addTarget(target: Targets): Observable<Targets> {
//     return this.http.post<Targets>(this.CreateTargetUrl, target, this.httpOptions).pipe(
//       tap((newTarget: Targets) => this.log(`added target w/ id=${newTarget.id}`)),
//       catchError(this.handleError<Targets>('addTarget'))
//     );
//   }


//   /** DELETE: delete the hero from the server */
//   deleteTarget(id: number): Observable<Targets> {
//     const url = `${this.DeleteTargetUrl}/${id}`;

//     return this.http.delete<Targets>(url, this.httpOptions).pipe(
//       tap(_ => this.log(`deleted target id=${id}`)),
//       catchError(this.handleError<Targets>('deleteTarget'))
//     );
//   }


//   /** PUT: update the hero on the server */
//   updateTarget(target: Targets): Observable<any> {
//     return this.http.put(this.UpdateTargetUrl, target, this.httpOptions).pipe(
//       tap(_ => this.log(`updated hero id=${target.id}`)),
//       catchError(this.handleError<any>('updateHero'))
//     );
//   }

// }
