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

  timerForWaitingChaudiereResponse!: Subscription;

  // UI
  waitingForResponse: boolean = false;
  waitingTimer: number = 0;
  responseChaudiere: string = 'Désactivée';
  waitingLockTimer: number = 10;


  // not responding
  timerNoResponseInSeconds:number = 10;
  isLock: boolean = false;
  lockSub!: Subscription;
  timerLockFinish: boolean = false;

  disjoncteurState!: boolean;
  disjoncteurSub!: Subscription;

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

    // lock
    this.lockSub = this.store.lockThermostat$.pipe(
      tap(value => this.isLock = value)
    ).subscribe();

    this.disjoncteurSub = this.store.disjoncteur$.pipe(
      tap(value => {
        this.disjoncteurState = value;
        this.tryToUnlock();
      })
    ).subscribe();
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
    if (this.processingOrder || this.order == 'NONE' || this.isLock) return;

    // enable the chaudiere
    if (this.order == 'ENABLE' && this.chaudiereState == 'DISABLE') {
      this.processingOrder = true;
      console.log(`processing order from controller : ${this.order}`);


      this.timerForWaitingChaudiereResponse = interval(1000).pipe(
        tap(s => {
          console.log(`controller waiting : ${s}`);
          this.waitingTimer = s;
          if (s == 10) {
            this.timerForWaitingChaudiereResponse.unsubscribe();
            this.responseChaudiereSub.unsubscribe();
            this.processingOrder = false;
            console.log('the chaudiere did not respond');
            this.responseChaudiere = `La chaudière n'a pas répondu`;
            this.waitingForResponse = false;
            this.lock();
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

          this.timerForWaitingChaudiereResponse.unsubscribe();
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


  private lock() {
    this.timerLockFinish = false;
    this.store.setLockThermostat(true);
    this.store.setThermostatActivated(false);
    this.store.setDisjoncteur(false);

    const timer = interval(1000).pipe(
      tap(s => {
        console.log(`lock waiting : ${s}`);
        this.waitingLockTimer = 10 - s;
        if (s == this.timerNoResponseInSeconds) {
          timer.unsubscribe();
          this.timerLockFinish = true;
          this.tryToUnlock();
        }
      })
    ).subscribe();    
  }

  private tryToUnlock() {
    if (this.isLock && this.timerLockFinish && this.disjoncteurState) {
      this.store.setLockThermostat(false);
    }
  }


  ngOnDestroy(): void {
    this.temperatureSub.unsubscribe();
    this.thermostatValueSub.unsubscribe();
    this.thermostatActivatedSub.unsubscribe();
    this.lockSub.unsubscribe(); 
    this.disjoncteurSub.unsubscribe();
  }
}