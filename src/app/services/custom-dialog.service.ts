import { Injectable } from '@angular/core';
import { DialogResult, DialogService } from '@progress/kendo-angular-dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomDialogService {
  constructor(private dialogService: DialogService) {
  }

  openDialog(component: any, dialogConf: any,isNew?:boolean): Observable<any> {
    const dialogRef = this.dialogService.open({
      content: component,
      ...dialogConf

    });
    const df = dialogRef.content.instance;
    df.data = dialogConf.data;
    if(isNew){
      // 配合 如果是 dialog 新增或編輯
      df.isNew=isNew;
    }

    return dialogRef.result;
  }
}
