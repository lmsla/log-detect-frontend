import { Component, OnInit } from '@angular/core';
import { Hero } from '../../models/hero';
import { DeviceCount } from '../../models/device_count';
import { HeroService } from '../../services/hero.service';
// import { HEROES } from '../mock-heroes';
import { MessageService } from '../../message.service';

// decorator function (裝飾器)，用於為該元件指定 Angular 所需的元資料
@Component({
  // Component(元件)的 CSS 元素選擇器
  selector: 'app-heroes',
  // Component 範本檔案的位置 (The location of the component's template file.)
  templateUrl: './heroes.component.html',
  // Component 私有 CSS 樣式表文件的位置。 (The location of the component's private CSS styles.)
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  hero: Hero = {
    id: 1,
    name: 'Windstorm',
    gender: 'male'
  };
  // heroes = HEROES;
  heroes: Hero[] = [];

  // selectedHero?: Hero;


  //往建構函式中新增一個私有的 heroService，其型別為 HeroService。
  constructor(private heroService: HeroService) { }

  // getHeroes(): void {
  //   this.heroes = this.heroService.getHeroes();
  // }
  ngOnInit(): void {
    this.getHeroes();

  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }




  // onSelect(hero: Hero): void {
  //   this.selectedHero = hero;
  //   this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  // }


}

// CSS 元素選擇器 app-heroes 用來在父元件的範本中匹配 HTML 元素的名稱，以識別出該元件。
// The CSS element selector, 'app-heroes', matches the name of the HTML element that identifies this component within a parent component's template.

// 始終要 export 這個元件類，以便在其它地方（比如 AppModule）匯入它。
// Always export the component class so you can import it elsewhere … like in the AppModule.
