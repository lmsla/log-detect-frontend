import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddEvent, CancelEvent, EditEvent, GridComponent, GridDataResult, RemoveEvent, SaveEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { map, Observable } from 'rxjs';
import { Targets } from 'src/app/models/target';
import { Indices } from 'src/app/models/target';
import { DeviceGroup } from 'src/app/models/target';
// import { Device } from 'src/app/models/device_count';
import { DropdownService } from 'src/app/services/dropdown.service';
import { IndicesService } from 'src/app/services/indices.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-log-management',
  templateUrl: './log-management.component.html',
  styleUrls: ['./log-management.component.scss']
})
export class LogManagementComponent implements OnInit {


  @Input() public indices: Indices;
  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10,
  };

  // @Input() public targets: Targets;
  // public view: Observable<GridDataResult>;
  // public gridState: State = {
  //   sort: [],
  //   skip: 0,
  //   take: 10,
  // };


  public formGroup: FormGroup;
  private indicesService: IndicesService;
  private editedRowIndex: number;
  $event: any;

  constructor(@Inject(IndicesService) indicesServiceFactory: () => IndicesService,
    private DropdownService: DropdownService,
    private confirmDialogService: ConfirmDialogService) { this.indicesService = indicesServiceFactory(); }


  public indicesDropwdownSource = new Array<any>();
  public groupDropdownSource = new Array<DeviceGroup>();

  ngOnInit(): void {
    console.log("init")
    this.view = this.indicesService.pipe(

      map((data) => process(data, this.gridState))

    );

    this.indicesService.getIndicesData();

    this.DropdownService.getGroup().subscribe({
      next: (d) => {
        this.groupDropdownSource = d;
      }, error: (e) => {
        alert(e);
      }
    });

    this.indicesService.readAllindices();

  }


  periods = [
    { label: '分鐘', value: 'minutes' },
    { label: '小時', value: 'hours' },
  ];


  public groupDropdownValueChange(event) {
    // 查找與事件相符的設備群組
    const selectedDeviceGroup = this.groupDropdownSource.find(x => x.device_group === event);

    if (selectedDeviceGroup) {
      // 創建一個新的FormGroup，將其設為formGroup的值
      // 避免前端出現 core.mjs:7739 ERROR Error: NG01002: Must supply a value for form control with name: 'id' (原資料中沒有 id)
      this.formGroup = new FormGroup({
        device_group: new FormControl(selectedDeviceGroup.device_group),
      });


    } else {
      console.error('Selected device group not found:', event);
    }
  }

  public onStateChange(state: State): void {
    console.log("onStateChange")
    this.gridState = state;

    this.indicesService.readAllindices();
  }

  private closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex) {
    // close the editor
    grid.closeRow(rowIndex);
    // reset the helpers
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  public addHandler(args: AddEvent): void {
    this.closeEditor(args.sender);
    // define all editable fields validators and default values
    this.formGroup = new FormGroup({
      id: new FormControl(),
      // target_id: new FormControl(this.targets.id),
      pattern: new FormControl("logstash-sample*", Validators.required),
      logname: new FormControl("some-fire-log", Validators.required),
      device_group: new FormControl("bimap", Validators.required),
      period: new FormControl("", Validators.required),
      unit: new FormControl(15, Validators.required),
      field: new FormControl("host.keyword", Validators.required),
      // filter_condition: new FormControl("",Validators.required)
    });
    // show the new row editor, with the `FormGroup` build above
    args.sender.addRow(this.formGroup);
  }



  public editHandler(args: EditEvent): void {
    // define all editable fields validators and default values
    const { dataItem } = args;
    this.closeEditor(args.sender);
    console.log("edit", this.formGroup, dataItem)

    // const periodValue = this.selectedPeriod ? this.selectedPeriod : dataItem.period;
    // console.log("periodValue", periodValue)
    this.formGroup = new FormGroup({
      id: new FormControl(dataItem.id),
      // target_id: new FormControl(dataItem.target_id, Validators.required),
      pattern: new FormControl(dataItem.pattern, Validators.required),
      logname: new FormControl(dataItem.logname, Validators.required),
      device_group: new FormControl(dataItem.device_group, Validators.required),
      period: new FormControl(dataItem.period, Validators.required),
      unit: new FormControl(dataItem.unit, Validators.required),
      field: new FormControl(dataItem.field, Validators.required),
      // filter_condition: new FormControl(dataItem.filter_condition, Validators.required), // query:(language:kuery.query:'win32-status.keyword:1236);
    });

    this.editedRowIndex = args.rowIndex;
    // put the row in edit mode, with the `FormGroup` build above
    args.sender.editRow(args.rowIndex, this.formGroup);
  }

  public cancelHandler(args: CancelEvent): void {
    // close the editor for the given row
    this.closeEditor(args.sender, args.rowIndex);
  }

  /// 測試
  public saveHandler1({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
    let product: Indices = formGroup.value;
    // product.id = this.groupDropdownSource.find(x => x.device_group == product.device_group).text;

    this.indicesService.save1(product, isNew);

    sender.closeRow(rowIndex);
  }

  public removeHandler1(args: RemoveEvent): void {
    // remove the current dataItem from the current data source,
    // `editService` in this example
    console.log("delete")
    this.confirmDialogService.openConfirmDialog('確定要執行此操作嗎？')
      .subscribe(result => {
        console.log("確認對話框已關閉，結果為: ", result);
        if (result) {
          console.log('使用者點擊了確認');
          this.indicesService.remove1(args.dataItem);
          // this.removeDataItem(args.dataItem);
        } else {
          console.log('使用者取消了操作');
        }
      });
    console.log("delete1")
    // this.indicesService.remove(args.dataItem);
  }


  selectedPeriod: string;

  updatePeriodValue(selectedValue: any): void {
    console.log("selectedValue",selectedValue)
    console.log("selectedValue.value",selectedValue.value)
    this.selectedPeriod = selectedValue ? selectedValue.value : null;
    console.log("selectedPeriod", this.selectedPeriod);
  }

  timeconvert(dataItem: any): string {
    if (dataItem) {
      if (dataItem === "hours") {
        return '小時';
      } else if (dataItem === "minutes") {
        return '分鐘';
      }
    }
    return '';
  }

}
