import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private temperature = new BehaviorSubject<number>(20);
  temperature$: Observable<number> = this.temperature.asObservable();


  private requestChaudiere = new BehaviorSubject<boolean>(false);
  requestChaudiere$: Observable<boolean> = this.requestChaudiere.asObservable();

  private responseStartChaudiere = new BehaviorSubject<boolean>(false);
  responseStartChaudiere$: Observable<boolean> = this.responseStartChaudiere.asObservable();

  
  private disjoncteur = new BehaviorSubject<boolean>(true);
  disjoncteur$: Observable<boolean> = this.disjoncteur.asObservable();

  private thermostatActivated = new BehaviorSubject<boolean>(false);
  thermostatActivated$: Observable<boolean> = this.thermostatActivated.asObservable();

  private thermostatValue = new BehaviorSubject<number>(20);
  thermostatValue$: Observable<number> = this.thermostatValue.asObservable();


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

  setDisjoncteur(state: boolean) {
    this.disjoncteur.next(state);
  }

  setThermostatActivated(state: boolean) {
    this.thermostatActivated.next(state);
  }

  setThermostatValue(value: number) {
    this.thermostatValue.next(value);
  }


  createResquestChaudiere(state: boolean) {
    this.requestChaudiere.next(state);
  }

  setResponseChaudiere(state: boolean) {
    this.responseStartChaudiere.next(state);
  }
}
