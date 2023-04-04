import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';


@Component({
  selector: 'app-disjoncteur',
  templateUrl: './disjoncteur.component.html',
  styleUrls: ['./disjoncteur.component.scss']
})
export class DisjoncteurComponent implements OnInit, OnDestroy {
  
  isChecked!: boolean;
  subscription!: Subscription;

  constructor(private store: StoreService) { }

  ngOnInit(): void {
    this.subscription = this.store.disjoncteur$.pipe(
      tap(value => this.isChecked = value)
    ).subscribe();
  }

  onCheckboxChange() {
    this.store.setDisjoncteur(this.isChecked);
    console.log(`Disjoncteur state : ${this.isChecked}`);
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
