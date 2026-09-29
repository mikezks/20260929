import { Routes } from "@angular/router";
import { provideEffects } from "@ngrx/effects";
import { provideState } from "@ngrx/store";
import { Airport } from "../feature-flight/airport/airport";
import { FlightBookingComponent } from "../feature-flight/flight-booking/flight-booking.component";
import { FlightEditComponent } from "../feature-flight/flight-edit/flight-edit.component";
import { FlightSearchComponent } from "../feature-flight/flight-search/flight-search.component";
import { MyFlightsComponent } from "../feature-flight/my-flights/my-flights.component";
import { resolveFlight } from "../logic-flight/data-access/flight.resolver";
import { TicketEffects } from "../logic-flight/state/redux/effects";
import { ticketFeature } from "../logic-flight/state/redux/reducer";
import { HttpClient, provideHttpClient, withInterceptors, withRequestsMadeViaParent } from "@angular/common/http";
import { authInterceptor } from "@flight-demo/shared/core";
import { inject, provideEnvironmentInitializer } from "@angular/core";


export const BOOKING_ROUTES: Routes = [
  {
    path: '',
    component: FlightBookingComponent,
    providers: [
      provideState(ticketFeature),
      provideEffects([TicketEffects]),
      provideHttpClient(
        withInterceptors([
          authInterceptor
        ]),
        withRequestsMadeViaParent()
      ),
      provideEnvironmentInitializer((
        http = inject(HttpClient)
      ) => {
        http.get('https://demo.angulararchitects.io/api/flight/3')
          .subscribe(flight => console.log(flight))
      })
    ],
    children: [
      {
        path: '',
        redirectTo: 'flight',
        pathMatch: 'full'
      },
      {
        path: 'flight',
        children: [
          {
            path: '',
            redirectTo: 'search',
            pathMatch: 'full'
          },
          {
            path: 'search',
            component: FlightSearchComponent,
          },
          {
            path: 'edit/:id',
            component: FlightEditComponent,
            resolve: {
              flight: resolveFlight
            }
          }
        ]
      },
      {
        path: 'my-flights',
        component: MyFlightsComponent,
      },
      {
        path: 'airport',
        component: Airport,
      }
    ]
  }
];

export default BOOKING_ROUTES;
