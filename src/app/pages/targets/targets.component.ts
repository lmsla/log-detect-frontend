import { Targets } from './../../models/target';
import { Component, OnInit, Inject } from '@angular/core';
import { TargetService } from '../../services/target.service';
import { SortDescriptor } from '@progress/kendo-data-query';
import { AddEvent, CancelEvent, EditEvent, GridComponent, GridDataResult, RemoveEvent, SaveEvent } from '@progress/kendo-angular-grid';
import { Observable, of, map } from 'rxjs';
import { State, process } from '@progress/kendo-data-query';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '@progress/kendo-angular-dialog';
import { DialogConf } from 'src/app/models/dialog-conf';
import { CustomDialogService } from 'src/app/services/custom-dialog.service';
import { TargetDialogTemplateComponent } from 'src/app/shared/target-dialog-template/target-dialog-template.component';

@Component({
  selector: 'app-targets',
  templateUrl: './targets.component.html',
  styleUrls: ['./targets.component.css']
})

export class TargetsComponent implements OnInit {


  public
  // public timeUnitList = TIME_UNIT_LIST
  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10,
  };
  public formGroup: FormGroup;

  private targetService: TargetService;
  private editedRowIndex: number;

  constructor(@Inject(TargetService) targetServiceFactory: () => TargetService, private dialogService: DialogService, private customDialogService: CustomDialogService) {
    this.targetService = targetServiceFactory();

  }

  public ngOnInit(): void {
    this.view = this.targetService.pipe(
      map((data) => process(data, this.gridState))
    );

    this.targetService.read();
  }

  public onStateChange(state: State): void {
    this.gridState = state;

    this.targetService.read();
  }

  public addHandler(args: AddEvent): void {
    this.closeEditor(args.sender);

    // define all editable fields validators and default values
    this.formGroup = new FormGroup({
      id: new FormControl(),
      subject: new FormControl("新的標的", Validators.required),
      to: new FormControl([],Validators.required),
    });
    // show the new row editor, with the `FormGroup` build above
    args.sender.addRow(this.formGroup);
  }

  public editHandler(args: EditEvent): void {
    // define all editable fields validators and default values

    const { dataItem } = args;
    this.closeEditor(args.sender);
    console.log("test",this.formGroup,dataItem)
    this.formGroup = new FormGroup({
      id: new FormControl(dataItem.id, Validators.required),
      subject: new FormControl(dataItem.subject, Validators.required),
      to: new FormControl(dataItem.to, Validators.required),
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
    const product: Targets = formGroup.value;


    this.targetService.save(product, isNew);

    sender.closeRow(rowIndex);
  }

  public removeHandler(args: RemoveEvent): void {
    // remove the current dataItem from the current data source,
    // `editService` in this example
    this.targetService.remove(args.dataItem);
  }

  public editItem(item: any): void {
    console.log("item: ", item);
    // Open the dialog
    this.opened = true;
  }

  public opened = false;

  public timeUnitDialogClose(status?: string): void {
    console.log(`Dialog result: ${status}`);
    this.opened = false;
  }

  public open(): void {
    this.opened = true;
  }

  public changeTimeUnit(timeUnit: string): void {
    // console.log("timeUnit:", timeUnit)
    this.formGroup.get('alias').setValue(timeUnit);
    this.formGroup.get('time_unit').setValue("");
    this.formGroup.get('time_period').setValue(0);
    console.log(" this.formGroup.value", this.formGroup.value);
    this.timeUnitDialogClose('finish');
  }

  private closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex) {
    // close the editor
    grid.closeRow(rowIndex);
    // reset the helpers
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }


  public createTarget() {
    let dialogConf: DialogConf = new DialogConf();
    dialogConf.title = '新增'

    this.formGroup = new FormGroup({
      id: new FormControl(),
      subject: new FormControl("a", Validators.required),
      to: new FormControl(["example@bimap.co"], Validators.required),

    });
    dialogConf.data = this.formGroup;
    console.log('dataItem:', this.formGroup);
    this.customDialogService.openDialog(TargetDialogTemplateComponent, dialogConf, true).subscribe((res) => {
      // console.log("res:", res);
      if (res) {
        // console.log(res.data);
        // isNew
        // 但目前原功能是壞的

        this.targetService.save(res.data.value, res.isNew);
      }

    })
  }


}



// export class TargetsComponent implements OnInit {

//   public gridItems: Observable<GridDataResult> | undefined;
//   public pageSize: number = 10;
//   public skip: number = 0;
//   public sortDescriptor: SortDescriptor[] = [];
//   public filterTerm: number | null = null;

//   constructor(private targetService: TargetService) { }

//   targets: Targets[] = [];


//   // ngOnInit(): void {
//   //   this.getTargets();
//   // }

//   getTargets(): void {
//     this.targetService.getTargets()
//       .subscribe(targets => this.targets = targets)

//   }
//   // getTarget(): void {
//   //   this.targetService.getTarget()
//   //   .subscribe(targets => this.targets = targets)

//   // }
//   ngOnInit(): void {
//     this.getTargets();
//     // 在 Angular 的生命週期鉤子中訂閱 getTargets 方法
//     this.targetService.getTargets().subscribe(targets => {
//       // 在訂閱內部調用 getProducts 方法並將從 API 獲取的資料作為參數傳遞
//       this.gridItems = this.targetService.getTarget(
//         targets, // 從 API 獲取的資料
//         this.skip,
//         this.pageSize,
//         this.sortDescriptor,
//         this.filterTerm
//       );
//     });
//   }


//   add(subject: string): void {
//     subject = subject.trim();
//     if (!subject) { return; }
//     this.targetService.addTarget({ subject } as Targets)
//       .subscribe(target => {
//         this.targets.push(target);
//       });
//   }


//   delete(target: Targets): void {
//     this.targets = this.targets.filter(a => a !== target);
//     this.targetService.deleteTarget(target.id).subscribe();
//   }



//   deletebyid(id: number): void {
//     // 從 this.targets 中過濾掉 ID 不等於給定 ID 的目標
//     this.targets = this.targets.filter(target => target.id !== id);
//     this.targetService.deleteTarget(id).subscribe(
//       () => {
//         console.log(`Target with ID ${id} deleted successfully.`);
//       },
//       error => {
//         console.error('Error deleting target:', error);
//       }
//     );
//   }

//   // save(): void {
//   //   if (this.targets) {
//   //     this.targetService.updateTarget(this.targets)
//   //       .subscribe(() => this.goBack());
//   //   }
//   // }

// }
