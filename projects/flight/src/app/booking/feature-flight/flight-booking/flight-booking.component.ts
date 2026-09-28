import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-flight-booking',
  standalone: false,
  template: `
    <div>
      <router-outlet></router-outlet>
    </div>
  `
})
export class FlightBookingComponent {}
