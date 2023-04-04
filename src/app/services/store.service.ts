import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private temperature = new BehaviorSubject<number>(35);
  temperature$: Observable<number> = this.temperature.asObservable();

  private chaudiereRun = new BehaviorSubject<boolean>(false);
  chaudiereRun$: Observable<boolean> = this.chaudiereRun.asObservable();

  constructor() {
    interval(5000).pipe(
      tap(() => this.setTemperature(this.temperature.getValue() - 1))
    ).subscribe();
  }

  setTemperature(temperature: number) {
    this.temperature.next(temperature);
  }

  getTemperatureValue() {
    return this.temperature.value;
  }
}
