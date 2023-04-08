import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, interval, tap } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent implements OnInit, OnDestroy {
  
  temperature: number = 20;
  temperatureSub!: Subscription;

  thermostatValue: number = 20;
  thermostatValueSub!: Subscription;

  thermostatActivated: boolean = false;
  thermostatActivatedSub!: Subscription;

  chaudiereState: 'ENABLE' | 'DISABLE' = 'DISABLE';
  responseChaudiere$!: Observable<boolean>;
  responseChaudiereSub!: Subscription;
  
  processingOrder: boolean = false;
  order : 'ENABLE' | 'DISABLE' | 'NONE' = 'NONE';

  // UI
  waitingForResponse: boolean = false;
  waitingTimer: number = 0;
  responseChaudiere: string = 'Désactivée';

  constructor(private store: StoreService) { }
  
  ngOnInit(): void {
    // get temperature value
    this.temperatureSub = this.store.temperature$.pipe(
      tap(value => {
        this.temperature = value;
        this.order = this.calculateChaudiereOrder();
        this.handleOrder();
      })
    ).subscribe();

    // get thermostat value
    this.thermostatValueSub = this.store.thermostatValue$.pipe(
      tap(value => {
        this.thermostatValue = value;
        console.log(this.thermostatValue);
      })
    ).subscribe();

    // get if thermostat is activated
    this.thermostatActivatedSub = this.store.thermostatActivated$.pipe(
      tap(value => this.thermostatActivated = value)
    ).subscribe();

    // get if chaudiere started
    this.responseChaudiere$ = this.store.responseStartChaudiere$;
  }



  private calculateChaudiereOrder(): 'ENABLE' | 'DISABLE' | 'NONE' {
    if (!this.thermostatActivated) return 'DISABLE';

    const target = this.thermostatValue;
    const current = this.temperature;

    if (current > target + 2) {
      return 'DISABLE';
    }

    if (current < target - 2) {
      return 'ENABLE';
    }

    return 'NONE';
  }

  private handleOrder() {
    if (this.processingOrder || this.order == 'NONE') return;

    // enable the chaudiere
    if (this.order == 'ENABLE' && this.chaudiereState == 'DISABLE') {
      this.processingOrder = true;
      console.log(`processing order from controller : ${this.order}`);


      const timer = interval(1000).pipe(
        tap(s => {
          console.log(`controller waiting : ${s}`);
          this.waitingTimer = s;
          if (s == 10) {
            timer.unsubscribe();
            this.processingOrder = false;
            console.log('the chaudiere did not respond');
            this.responseChaudiere = `La chaudière n'a pas répondu`;
            this.waitingForResponse = false;
          }
        })
      ).subscribe();
      
      let isFirstValue = true;

      this.responseChaudiereSub = this.responseChaudiere$.pipe(
        tap(value => {
          if (isFirstValue) {
            isFirstValue = false;
            return;
          }

          if (value) {
            console.log('controller received : the chaudiere started');
            this.chaudiereState = 'ENABLE';
            this.responseChaudiere = `La chaudière est activée`;
          } else {
            console.log('controller received : the chaudiere did not start');
            this.responseChaudiere = `La chaudière est désactivée`;
          }

          timer.unsubscribe();
          this.responseChaudiereSub.unsubscribe();
          this.processingOrder = false;
          this.waitingForResponse = false;
        })
      ).subscribe();

      this.store.createResquestChaudiere(true);
      this.waitingForResponse = true;

    }

    // disable the chaudiere
    if (this.order == 'DISABLE' && this.chaudiereState == 'ENABLE') {
      this.processingOrder = true;
      console.log(`processing order from controller : ${this.order}`);

      this.store.createResquestChaudiere(false);
      this.chaudiereState = 'DISABLE';
      this.responseChaudiere = `La chaudière est désactivée`;
      this.processingOrder = false;
    }
  }


  ngOnDestroy(): void {
    this.temperatureSub.unsubscribe();
    this.thermostatValueSub.unsubscribe();
    this.thermostatActivatedSub.unsubscribe();
  }
}