import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlightFilterComponent } from './flight-filter/flight-filter.component';


@NgModule({
  declarations: [
    FlightFilterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    FlightFilterComponent
  ]
})
export class UiFlightModule { }
