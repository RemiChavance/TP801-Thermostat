import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, interval, tap } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-chaudiere',
  templateUrl: './chaudiere.component.html',
  styleUrls: ['./chaudiere.component.scss']
})
export class ChaudiereComponent implements OnInit, OnDestroy {
  
  runMessage$!: Observable<boolean>;

  runState!: Observable<number>;
  runSubscription!: Subscription;

  isRunning: boolean = false;

  constructor(private store: StoreService) { }

  ngOnInit(): void {
    this.runState = interval(1000).pipe(
      tap(() => this.store.setTemperature(this.store.getTemperatureValue() + 1))
    );

    this.runMessage$ = this.store.chaudiereRun$.pipe(
      tap(value => {
        console.log(`chaudiere run : ${value}`);
        if (value) this.start();
      })
    );
  }

  start() {
    this.runSubscription = this.runState.subscribe();
    this.isRunning = true;
  }

  stop() {
    this.runSubscription.unsubscribe();
    this.isRunning = false;
  }

  ngOnDestroy(): void {
      this.runSubscription.unsubscribe();
  }
}
