import { Injectable } from '@angular/core';
import { Hero } from '../models/hero';
import { DeviceCount } from '../models/device_count';
import { HEROES } from '../mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from '../message.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HeroService {


  constructor(private http: HttpClient,private messageService: MessageService) { }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
//api/v1/Device/count
  private deviceUrl = environment.apiDomain + '/api/v1/Device/count';

  // getHeroes(): Hero[] {
  //   return HEROES;
  // }

  getdevice(): Observable<DeviceCount[]> {
    return this.http.get<DeviceCount[]>(this.deviceUrl)

  }

  getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messageService.add('HeroService: fetched heroes');
    return heroes;
  }

  getHero(id: number): Observable<Hero> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = HEROES.find(h => h.id === id)!;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }

}
