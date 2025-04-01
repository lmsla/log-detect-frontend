import { TargetDetailService } from './../../services/target_detail.service';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddEvent, CancelEvent, EditEvent, GridComponent, GridDataResult, RemoveEvent, SaveEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { map, Observable } from 'rxjs';
import { Targets, Indices, Index } from 'src/app/models/target';
import { DeviceGroup } from 'src/app/models/target';
import { Logname } from 'src/app/models/target';
// import { Device } from 'src/app/models/device_count';
import { DropdownService } from 'src/app/services/dropdown.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';



@Component({
  selector: 'app-target-detail',
  templateUrl: './target-detail.component.html',
  styleUrls: ['./target-detail.component.scss']
})
export class TargetDetailComponent implements OnInit {

  @Input() public targets: Targets;
  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10,
  };

  public formGroup: FormGroup;
  public formGroup1: FormGroup;
  private targetDetailService: TargetDetailService;
  // private indicesService: IndicesService;
  private editedRowIndex: number;
  public selectedLogname: string;
  currentLogname: string;
  $event: any;


  // private confirmDialogService: ConfirmDialogService;

  constructor(
    @Inject(TargetDetailService) targetDetailServiceFactory: () => TargetDetailService,
    private dropdownService: DropdownService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.targetDetailService = targetDetailServiceFactory();
  }

  public indicesDropwdownSource = new Array<Indices>();

  public groupDropdownSource = new Array<DeviceGroup>();
  public dropdownSource = new Array<Index>();

  ngOnInit(): void {
    this.view = this.targetDetailService.pipe(
      map((data) => process(data, this.gridState))
    );
    this.targetDetailService.read(this.targets);

    this.dropdownService.getGroup().subscribe({
      next: (d) => {
        this.groupDropdownSource = d;
      }, error: (e) => {
        alert(e);
      }
    });

    this.targetDetailService.getAllIndices().subscribe({
      next: (d) => {
        this.dropdownSource = d;
      }, error: (e) => {
        alert(e);
      }
    });



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

  public lognameDropdownValueChange(event) {

    let indices = {};
    Object.assign(indices, this.dropdownSource.find(x => x.id == event));

    console.log(indices, this.dropdownSource);

    delete (indices as any).created_at;
    delete (indices as any).deleted_at;
    delete (indices as any).updated_at;
    delete (indices as any).period;
    delete (indices as any).unit;
    delete (indices as any).field;
    delete (indices as any).device_group;

    this.formGroup.setValue(indices);

  }


  public lognameDropdownValueChange1(event) {

    const selectedLogname = event; // 提取 logname 字段的值

    console.log("event", event)
    // // 查找與事件相符的設備群組
    const selectedDeviceGroup = this.dropdownSource.find(x => x.logname === selectedLogname);

    if (selectedDeviceGroup) {
      // 創建一個新的FormGroup，將其設為formGroup的值
      // 避免前端出現 core.mjs:7739 ERROR Error: NG01002: Must supply a value for form control with name: 'id' (原資料中沒有 id)

      this.formGroup = new FormGroup({
        logname: new FormControl(selectedDeviceGroup.logname),
      });

    } else {
      console.error('Selected device group not found:', event);
    }

  }


  public onStateChange(state: State): void {
    this.gridState = state;

    this.targetDetailService.read({ target_id: this.targets.id });
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
      pattern: new FormControl(),
      logname: new FormControl(),
    });
    // show the new row editor, with the `FormGroup` build above
    args.sender.addRow(this.formGroup);
  }

  public addHandler1(args: AddEvent): void {
    this.closeEditor(args.sender);
    // define all editable fields validators and default values
    this.formGroup = new FormGroup({
      id: new FormControl(),
      target_id: new FormControl(this.targets.id),
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


  selectedPeriod: string;

  updatePeriodValue(selectedValue: any): void {
    console.log("selectedValue", selectedValue)
    console.log("selectedValue.value", selectedValue.value)
    this.selectedPeriod = selectedValue ? selectedValue.value : null;
    console.log("selectedPeriod", this.selectedPeriod);
  }



  public editHandler(args: EditEvent): void {
    // define all editable fields validators and default values
    const { dataItem } = args;
    this.closeEditor(args.sender);
    console.log("edit", this.formGroup, dataItem)
    this.formGroup = new FormGroup({
      id: new FormControl(dataItem.id, Validators.required),
      pattern: new FormControl(dataItem.pattern, Validators.required),
      logname: new FormControl(dataItem.logname, Validators.required),
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

  public saveHandler1({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
    let product: Indices = formGroup.value;
    // product.id = this.groupDropdownSource.find(x => x.device_group == product.device_group).text;

    this.targetDetailService.save(product, isNew);

    sender.closeRow(rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
    const r = this.dropdownSource.find(x => x.id == formGroup.value.id);
    const body = this.targets;
    let currentData = this.targetDetailService.getCurrentData();
    if (currentData.length == 0) {
      console.log("currentData", currentData);
      body["indices"] = [];
    } else {
      body["indices"] = this.targetDetailService.getCurrentData();
    }
    if (!isNew) {
      currentData.splice(rowIndex, 1);
      body.indices = currentData;
    }
    body.indices.push(r);
    this.targetDetailService.save(body, isNew);
    console.log("save body",body)
    sender.closeRow(rowIndex);
    console.log("exe save")
  }


  // 無確認視窗
  // public removeHandler(args: RemoveEvent): void {
  //   // remove the current dataItem from the current data source,
  //   // `editService` in this example
  //   console.log("delete")
  //   const body = this.targets;
  //   let currentData = this.targetDetailService.getCurrentData();
  //   console.log('使用者點擊了確認');
  //   console.log("args.dataItem", args.dataItem);
  //   console.log("currentData", currentData);
  //   body.indices = currentData.filter(function (obj) {
  //     console.log("obj", obj.id);
  //     console.log("args.dataItem.id", args.dataItem.id);
  //     return obj.id != args.dataItem.id;
  //   });

  //   this.targetDetailService.remove(body);
  //   console.log("body", body);
  //   console.log("remove");
  //   // this.removeDataItem(args.dataItem);


  //   console.log("delete1")
  //   // this.indicesService.remove(args.dataItem);
  // }



  public removeHandler(args: RemoveEvent): void {
    // remove the current dataItem from the current data source,
    // `editService` in this example
    console.log("delete")
    const body = this.targets;
    this.confirmDialogService.openConfirmDialog('確定要執行此操作嗎？')
      .subscribe(result => {
        console.log("確認對話框已關閉，結果為: ", result);
        if (result) {

          let currentData = this.targetDetailService.getCurrentData();
          console.log('使用者點擊了確認');
          console.log("args.dataItem", args.dataItem);
          console.log("currentData", currentData);
          body.indices = currentData.filter(function (obj) {
            console.log("obj",obj.id);
            console.log("args.dataItem.id",args.dataItem.id);
            return obj.id != args.dataItem.id;
          });
          this.targetDetailService.remove(body);
          console.log("body",body);
          console.log("remove");
          // this.removeDataItem(args.dataItem);
        } else {
          console.log('使用者取消了操作');
        }
      });
    console.log("delete1")
    // this.indicesService.remove(args.dataItem);
  }




}
