import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddEvent, CancelEvent, EditEvent, GridComponent, GridDataResult, RemoveEvent, SaveEvent } from '@progress/kendo-angular-grid';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
import { State, process } from '@progress/kendo-data-query';
import { map, Observable } from 'rxjs';
import { Device } from 'src/app/models/device_count';
import { DeviceService } from 'src/app/services/device_list.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';


@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {

  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10,
  };

  public formGroup: FormGroup;

  private deviceservice: DeviceService;
  private editedRowIndex: number;

  @ViewChild("textbox") public textbox: TextBoxComponent;

  constructor(@Inject(DeviceService) deviceServiceFactory: () => DeviceService,
    private confirmDialogService: ConfirmDialogService) {
    this.deviceservice = deviceServiceFactory();
  }

  // public ngAfterViewInit(): void {
  //   this.textbox.input.nativeElement.type = "password";
  // }

  // public toggleVisibility(): void {
  //   const inputEl = this.textbox.input.nativeElement;

  //   if (inputEl.type === "password") {
  //     inputEl.type = "text";
  //   } else {
  //     inputEl.type = "password";
  //   }
  // }

  public ngOnInit(): void {

    this.view = this.deviceservice.pipe(
      map((data) => process(data, this.gridState))
    );

    this.deviceservice.read();

  }

  public onStateChange(state: State): void {
    this.gridState = state;

    this.deviceservice.read();
  }

  public addHandler(args: AddEvent): void {
    this.closeEditor(args.sender);
    // define all editable fields validators and default values
    this.formGroup = new FormGroup({
      id: new FormControl(),
      name: new FormControl("10.99.1.138", Validators.required),
      device_group: new FormControl("bimap", Validators.required),
    });
    // show the new row editor, with the `FormGroup` build above
    args.sender.addRow(this.formGroup);
  }

  public editHandler(args: EditEvent): void {
    // define all editable fields validators and default values
    const { dataItem } = args;
    this.closeEditor(args.sender);

    this.formGroup = new FormGroup({
      id: new FormControl(dataItem.id),
      name: new FormControl(dataItem.name, Validators.required),
      device_group: new FormControl(dataItem.device_group, Validators.required),
    });

    this.editedRowIndex = args.rowIndex;
    // put the row in edit mode, with the `FormGroup` build above
    args.sender.editRow(args.rowIndex, this.formGroup);
  }

  public cancelHandler(args: CancelEvent): void {
    // close the editor for the given row
    this.closeEditor(args.sender, args.rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
    const product: Device = formGroup.value;

    // if (product.auth) {
    //   product.auth = 1;
    // } else {
    //   product.auth = 0;
    // }

    this.deviceservice.save(product, isNew);

    sender.closeRow(rowIndex);
  }

  public removeHandler(args: RemoveEvent): void {
    // remove the current dataItem from the current data source,
    // `editService` in this example
    this.confirmDialogService.openConfirmDialog('確定要執行此操作嗎？')
      .subscribe(result => {
        console.log("確認對話框已關閉，結果為: ", result);
        if (result) {
          console.log('使用者點擊了確認');
          this.deviceservice.remove(args.dataItem);
          // this.removeDataItem(args.dataItem);
        } else {
          console.log('使用者取消了操作');
        }
      });
    console.log("delete1")
  }

  private closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex) {
    // close the editor
    grid.closeRow(rowIndex);
    // reset the helpers
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  public clearFilter(): void {
    this.gridState.filter = {
      logic: 'and',
      filters: []
    };

    this.deviceservice.read();
  }


}
