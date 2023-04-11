import { Component } from '@angular/core';
import { interval, tap } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent {

  startTime!: string;
  stopTime!: string;
  state: 'Désactivé' | 'Activé' = 'Désactivé';
  isRunning: boolean = false;

  constructor(private store: StoreService) { }

  onValidate() {
    if (this.firstGreaterThanSecond(this.startTime, this.stopTime)) return;

    this.isRunning = true;
    
    const timer = interval(1000).pipe(
      tap(s => {
        console.log(`program start waiting : ${s}`);
        const current = this.getCurrentDate(); 
        console.log(`current: ${current}  |  start: ${this.startTime}`);

        if (this.firstGreaterThanSecond(current, this.startTime)) {
          this.startChaudiereFor();
          timer.unsubscribe();
        }
      })
    ).subscribe();

  }


  private startChaudiereFor() {
    this.state = 'Activé';
    this.store.setLockThermostat(true);
    this.store.createResquestChaudiere(true);

    const timer = interval(1000).pipe(
      tap(s => {
        console.log(`program stop waiting : ${s}`);
        const current = this.getCurrentDate(); 
        console.log(`current: ${current}  |  stop: ${this.stopTime}`);

        if (this.firstGreaterThanSecond(current, this.stopTime)) {
          console.log('Stop Program');
          this.state = 'Désactivé';
          this.isRunning = false;
          this.store.createResquestChaudiere(false);
          this.store.setLockThermostat(false);
          timer.unsubscribe();
        }
      })
    ).subscribe();
  }

  private firstGreaterThanSecond(date1: string, date2: string) : boolean {
    const parts1 = date1.split(':');
    const parts2 = date2.split(':');

    if (parts1[0] < parts2[0]) return false;
    if (parts1[0] > parts2[0]) return true;

    if (parts1[1] < parts2[1]) return false;
    return true;
  }

  private getCurrentDate() {
    const now = new Date();
    let hours = now.getHours();
    let mins = now.getMinutes()

    let hoursString!: string;
    let minsString!: string;

    if (hours < 10) hoursString = '0' + hours;
    else hoursString = hours.toString();

    if (mins < 10) minsString = '0' + mins;
    else minsString = mins.toString();

    return hoursString + ':' + minsString;
  }
}
