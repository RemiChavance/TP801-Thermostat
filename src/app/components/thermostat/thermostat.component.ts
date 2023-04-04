import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat.component.html',
  styleUrls: ['./thermostat.component.scss']
})
export class ThermostatComponent implements OnInit, OnDestroy {

  value!: number;
  isActivated: boolean = false;

  isActivatedSubscription!: Subscription;

  constructor(private store: StoreService) { }

  ngOnInit(): void {
    this.isActivatedSubscription = this.store.thermostatActivated$.pipe(
      tap(value => this.isActivated = value)
    ).subscribe();
  }

  onActivate() {
    this.store.setThermostatActivated(true);
  }

  onDeactivate() {
    this.store.setThermostatActivated(true);
  }

  onChange() {
    this.store.setThermostatValue(this.value);
  }

  ngOnDestroy(): void {
    this.isActivatedSubscription.unsubscribe();    
  }
}