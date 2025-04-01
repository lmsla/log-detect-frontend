import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DialogContentBase, DialogRef } from "@progress/kendo-angular-dialog";


@Component({
  selector: 'app-target-dialog-template',
  templateUrl: './target-dialog-template.component.html',
  styleUrls: ['./target-dialog-template.component.scss']
})
export class TargetDialogTemplateComponent implements OnInit {

  @Input() public data: FormGroup;
  @Input() public isNew: boolean; // t:新增 or f:編輯

  constructor(public dialog: DialogRef) { }

  ngOnInit(): void {
    console.log("data:" , this.data);
  }

  public save(): void {
    this.dialog.close({ status: "success", data: this.data, isNew: this.isNew });

}

}


export class TargetDetailModel {
  subject: string = '';
  to: string = '';

}
