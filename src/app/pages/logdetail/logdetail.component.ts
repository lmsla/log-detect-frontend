import { Component, OnInit } from '@angular/core';
// import { ChartsModule } from "@progress/kendo-angular-charts";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownService } from 'src/app/services/dropdown.service';
import { HistoryService } from 'src/app/services/history.service';
import { TargetDetailService } from 'src/app/services/target_detail.service';
import { Logname } from 'src/app/models/target';
import { History } from 'src/app/models/history'
import {LognameCheck} from 'src/app/models/history'
import { Router } from "@angular/router";
import { PageChangeEvent } from "@progress/kendo-angular-pager";


@Component({
  selector: 'app-logdetail',
  templateUrl: './logdetail.component.html',
  styleUrls: ['./logdetail.component.scss'],

})
export class LogdetailComponent implements OnInit {

  constructor(private dropdownService: DropdownService, private historyService: HistoryService, private targetDetailService:TargetDetailService,public router: Router) {

  }

  public formGroup: FormGroup;
  public dropdownSource = new Array<Logname>();
  public historyData = new Array<History>();
  public selectedLogname: string;
  public chartData = new Array<History>();
  public pagedChartData: History[] = [];
  currentLogname: string;

  ngOnInit(): void {

    this.dropdownService.getlogname().subscribe({
      next: (d) => {
        this.dropdownSource = d;
        // 在下拉選單數據加載後設置表單的初始值為第一個選項
        if (this.dropdownSource.length > 0) {
          this.formGroup.patchValue({ logname: this.dropdownSource[0].logname });
          this.currentLogname = this.dropdownSource[0].logname;
          this.loadHistoryData();
        }
      }, error: (e) => {
        alert(e);
      }
    });

    this.formGroup = new FormGroup({
      logname: new FormControl('', Validators.required)
    });
    console.log("logname1", this.formGroup)

    this.loadHistoryData(); // 初始化時load一次 history data
    this.getLognameCheck()

  }

  lognameCheck: LognameCheck[] = [];

  getLognameCheck(): void {
    this.historyService.getLogNameData()
      .subscribe(lognameCheck => this.lognameCheck = lognameCheck)
  }


  loadHistoryData(): void {
    const logname = this.formGroup.value.logname;
    if (logname) {
      this.historyService.getHistoryData(logname).subscribe(
        data => {
          this.historyData = data;
          this.chartData = this.prepareChartData(data).sort((time, name) => {
            return time.time.localeCompare(name.time); // 假設您的 xField 是字符串，可以使用 localeCompare 進行排序
          });
          this.loadPagedData();
        },
        error => {
          console.error('Error fetching history data:', error);
        }
      );
    }
  }


  prepareChartData(historyData: History[]): any[] {

    return historyData.map(item => {

      return {
        time: item.time,
        name: item.name,
        value: item.lost
      };
    });
  }



  public lognameDropdownValueChange(event) {

    const selectedLogname = event; // 提取 logname 字段的值

    // console.log("event", event)
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
    this.loadHistoryData();

  }


  handleButtonClick(event: any, logname: LognameCheck): void {
    // 設置表單控件的值為點擊的 logname
    this.formGroup.patchValue({ logname: logname.name });
    this.currentLogname = logname.name;
    // 調用 loadHistoryData
    this.loadHistoryData();
  }


  // public handleButtonClick(event: any, logname: LognameCheck): void {

  //   const selectedLogname = event; // 提取 logname 字段的值

  //   console.log("event", event)
  //   console.log("logname", logname)
  //   // // 查找與事件相符的設備群組
  //   const selectedDeviceGroup = this.dropdownSource.find(x => x.logname === selectedLogname);

  //   if (logname) {
  //     // 創建一個新的FormGroup，將其設為formGroup的值
  //     // 避免前端出現 core.mjs:7739 ERROR Error: NG01002: Must supply a value for form control with name: 'id' (原資料中沒有 id)

  //     this.formGroup = new FormGroup({
  //       logname: new FormControl(selectedDeviceGroup.logname),
  //     });

  //   } else {
  //     console.error('Selected device group not found:', event);
  //   }
  //   this.loadHistoryData();

  // }


  public gethpColor(item: any): string {
    // console.log('getColor value:', item);
    // 根據 value 的值返回相應的顏色
    // console.log("item.value.Lost", item.value.value)
    if (item.value.value === 'true') {
      return '#CC0033'; // 紅色
    } else if (item.value.value === 'false') {
      return '#339933'; // 綠色
    } else if (item.value.value === 'none'){
      return 'rgb(116, 112, 112)'; // 白色
    } else{
      return '	#FFFFFF'; // 白色
    }
  }

  /// #FF0000 紅色
  /// #00FF00 綠色

  public getColor(item: any): string {
    // console.log('getColor value:', item);
    // 根據 value 的值返回相應的顏色
    // console.log("item1", item.lost)
    // console.log("item.value.Lost", item.value)
    if (item.lost === 'true') {
      return '#CC0033'; // 紅色
    } else if (item.lost === 'false') {
      return '#339933'; // 綠色
    } else if (item.lost === 'none'){
      return '	#FFFFFF'; // 白色
    } else{
      return '	#FFFFFF'; // 白色
    }
  }


  public size = "";

  public get getSize(): number {
    return this.size === "" ? undefined : Number.parseInt(this.size, 5);
  }

  // pagedChartData: any[] = []; // 用于显示当前页的数据
  totalItems: number; // 总项目数
  pageSize: number = 15; // 每页显示的项目数
  currentPage: number = 1; // 当前页码
  public skip = 0;


  onPageChange(event: any) {
    console.log("event", event)

    this.skip = event.skip;
    this.pageSize = event.take;
    if (event.skip !== undefined && event.take !== undefined) {
      this.currentPage = Math.floor(event.skip / event.take) + 1;
      console.log("currentPage", this.currentPage);
      this.loadPagedData(); // 在页面变化时重新加载当前页的数据
    }
  }


  // loadPagedData() {
  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   console.log("chartData",this.chartData)
  //   this.pagedChartData = this.chartData.slice(startIndex, endIndex);
  //   console.log("pagedChartData",this.pagedChartData)
  // }

  public totalGroups: number = 0;
  public buttonCount = 5;
  public sizes = [10, 20, 50];
  loadPagedData() {

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // console.log("chartData", this.chartData)
    // 創建一個對象來存儲每個 b 欄位對應的所有資料
    const groupedData = {};
    this.chartData.forEach(item => {
      if (!groupedData[item.name]) {
        groupedData[item.name] = [];
      }
      groupedData[item.name].push(item);
    });
    // console.log("groupedData", groupedData)
    // 將每個 b 欄位的資料合併到一個數組中
    // 计算数据组数
    this.totalGroups = Object.keys(groupedData).length;

    let pagedChartData = [];
    const keys = Object.keys(groupedData);
    for (let i = startIndex; i < Math.min(endIndex, keys.length); i++) {
      const key = keys[i];
      pagedChartData = pagedChartData.concat(groupedData[key]);
    }

    this.pagedChartData = pagedChartData;
    // console.log("pagedChartData", this.pagedChartData)
  }
}
