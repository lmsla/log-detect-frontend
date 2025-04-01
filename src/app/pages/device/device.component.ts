import { Component } from '@angular/core';
import { HeroService } from '../../services/hero.service';
import { DeviceCount } from '../../models/device_count';
import { Router } from "@angular/router";


@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent {


  devices: DeviceCount[] = [];
  //往建構函式中新增一個私有的 heroService，其型別為 HeroService。
  constructor(private heroService: HeroService, public router: Router) { }

  ngOnInit(): void {
    this.getDevices();
  }


  getDevices(): void {
    this.heroService.getdevice()
      .subscribe(devices => this.devices = devices)

  }



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
