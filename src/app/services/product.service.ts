import { Injectable } from '@angular/core';
import { DataResult, orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { Observable, of } from 'rxjs';
import { products } from '../data.products';

@Injectable()
//這是 Angular 框架提供的裝飾器，用於表示這個 ProductService 是可注入的，也就是說它可以作為其他 Angular 組件的依賴項目。
export class ProductService {
  public getProducts(
    // getProducts 方法：
    // 這是 ProductService 類中的一個公共方法，用於獲取產品數據。它接受幾個參數：
    skip: number,                      //skip：用於指定從結果集中跳過多少條記錄。
    pageSize: number,                  //pageSize：指定每頁顯示的記錄數量。
    sortDescriptor: SortDescriptor[],  //sortDescriptor：一個陣列，包含排序描述符，用於指定按照哪些屬性進行排序。
    filterTerm: number | null          //filterTerm：用於指定過濾條件的參數。
  ): Observable<DataResult> {
    let data;
    // 聲明了一個變數 data，它將用於存儲處理後的產品數據。
    if (filterTerm) {
      data = process(orderBy(products, sortDescriptor), {
        filter: {
          logic: 'and',
          filters: [
            {
              field: 'CategoryID',
              operator: 'eq',
              value: filterTerm
            }
          ]
        }
      }).data;
    } else {
      data = orderBy(products, sortDescriptor);
    }
    return of({
      data: data.slice(skip, skip + pageSize),
      total: data.length
    });
  }
}
