import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, interval, tap } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-chaudiere',
  templateUrl: './chaudiere.component.html',
  styleUrls: ['./chaudiere.component.scss']
})
export class ChaudiereComponent implements OnInit, OnDestroy {
  
  requestSub!: Subscription;

  runState!: Observable<number>;
  runStateSub!: Subscription;

  isRunning: boolean = false;

  constructor(private store: StoreService) { }

  ngOnInit(): void {
    this.runState = interval(1000).pipe(
      tap(() => this.store.setTemperature(this.store.getTemperatureValue() + 1))
    );

    this.requestSub = this.store.requestChaudiere$.pipe(
      tap(value => {
        console.log(`chaudiere run : ${value}`);
        //if (value) this.start();
      }),
      tap(value => {
        if (!value) {
          this.stop();
          return;
        }

        const timer = interval(1000).pipe(
          tap(s => {
            console.log(s);
            const itWorks = this.getRandomSeconds();
            if (s == itWorks) {
              this.start();
              timer.unsubscribe();
            }
          })
        ).subscribe();
      })
    ).subscribe();
  }

  private start() {
    this.runStateSub = this.runState.subscribe();
    this.isRunning = true;
    console.log('start !');
  }

  private stop() {
    if (this.runStateSub == null) return;
    this.runStateSub.unsubscribe();
    this.isRunning = false;
    console.log('stop !');
  }

  onClickStart() {
    this.store.createResquestChaudiere(true);
  }

  onClickStop() {
    this.store.createResquestChaudiere(false);
  }


  private getRandomSeconds() {
    return Math.floor(Math.random() * 10);
  }


  ngOnDestroy(): void {
    this.runStateSub.unsubscribe();
    this.requestSub.unsubscribe();
  }
}
