import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThermostatComponent } from './components/thermostat/thermostat.component';
import { ControllerComponent } from './components/controller/controller.component';
import { ChaudiereComponent } from './components/chaudiere/chaudiere.component';
import { DisjoncteurComponent } from './components/disjoncteur/disjoncteur.component';

@NgModule({
  declarations: [
    AppComponent,
    ThermostatComponent,
    ControllerComponent,
    ChaudiereComponent,
    DisjoncteurComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
