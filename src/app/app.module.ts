import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThermostatComponent } from './components/thermostat/thermostat.component';
import { ControllerComponent } from './components/controller/controller.component';
import { ChaudiereComponent } from './components/chaudiere/chaudiere.component';
import { DisjoncteurComponent } from './components/disjoncteur/disjoncteur.component';
import { ThermometreComponent } from './components/thermometre/thermometre.component';

@NgModule({
  declarations: [
    AppComponent,
    ThermostatComponent,
    ControllerComponent,
    ChaudiereComponent,
    DisjoncteurComponent,
    ThermometreComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
