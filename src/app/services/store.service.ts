import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private temperature = new BehaviorSubject<number>(35);
  temperature$: Observable<number> = this.temperature.asObservable();

  constructor() {
    interval(1000).pipe(
      tap(() => this.setTemperature(this.temperature.getValue() - 1))
    ).subscribe();
  }

  setTemperature(temperature: number) {
    this.temperature.next(temperature);
  }


}
