import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-thermometre',
  templateUrl: './thermometre.component.html',
  styleUrls: ['./thermometre.component.scss']
})
export class ThermometreComponent implements OnInit {

  temperature$!: Observable<number>;

  constructor(private store: StoreService) { }

  ngOnInit(): void {
    this.temperature$ = this.store.temperature$;
  }
}
