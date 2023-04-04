import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent implements OnInit, OnDestroy {
  
  temperature!: number;
  temperatureSub!: Subscription;

  thermostatValue!: number;
  thermostatValueSub!: Subscription;

  thermostatActivated!: boolean;
  thermostatActivatedSub!: Subscription;
  


  constructor(private store: StoreService) { }
  
  ngOnInit(): void {
    // get temperature value
    this.temperatureSub = this.store.temperature$.pipe(
      tap(value => this.temperature = value)
    ).subscribe();

    // get thermostat value
    this.thermostatValueSub = this.store.thermostatValue$.pipe(
      tap(value => {
        this.thermostatValue = value;
        this.setChaudiereState(this.thermostatActivated);
      })
    ).subscribe();

    // get if thermostat is activated
    this.thermostatActivatedSub = this.store.thermostatActivated$.pipe(
      tap(value => {
        this.thermostatActivated = value;
        this.setChaudiereState(this.thermostatActivated);
      })
    ).subscribe();
  }


  // start or stop the chaudiere
  private setChaudiereState(state: boolean) {
    if (state) {
      console.log(`la chaudière doit être activée avec pour objectif ${this.thermostatValue}`);
    } else {
      console.log(`la chaudière doit être désactivée`);
    }
  }

  private handleChaudiere() {
    if (!this.thermostatActivated) return;

    const target = this.thermostatValue;
    const current = this.temperature;

    if (current < target) {
      //this.store.setChaudiereRun(true);
    } else {
      //this.store.setChaudiereRun(false);
    }
  }


  ngOnDestroy(): void {
    this.temperatureSub.unsubscribe();
    this.thermostatValueSub.unsubscribe();
    this.thermostatActivatedSub.unsubscribe();
  }
}