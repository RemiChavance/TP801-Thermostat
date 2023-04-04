import { Component } from '@angular/core';


@Component({
  selector: 'app-disjoncteur',
  templateUrl: './disjoncteur.component.html',
  styleUrls: ['./disjoncteur.component.scss']
})
export class DisjoncteurComponent {
  isChecked = false;


  onCheckboxChange() {
    const value = this.isChecked ? "ON" : "OFF";
    console.log("La case à cocher est : " + value);
}

}
