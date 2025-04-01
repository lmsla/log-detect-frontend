import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent   {

  constructor(public router: Router) { }

  // 頁面選項卡
  public tabs = ["設備", "日誌失聯監控"];


  public onTabSelect(e) {
    let path: string;
    switch (e.title) {
      case "日誌失聯監控":
        path = "dashboard";
        break
      case "設備":
        path = "device";
        break;
    }
    // let path = e.title.toLowerCase();
    this.router.navigate(["/" + path]);
  }

}
