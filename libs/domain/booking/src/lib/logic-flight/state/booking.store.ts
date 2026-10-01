import { inject } from '@angular/core';
import { addMinutes } from '@flight-demo/shared/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, type, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { entityConfig, removeAllEntities, setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { FlightService } from '../data-access/flight.service';
import { Flight } from '../model/flight';
import { FlightFilter } from '../model/flight-filter';


export interface BookingState {
  filter: FlightFilter;
  basket: Record<number, boolean>;
}

export const initialBookingState: BookingState = {
  filter: {
    from: 'Hamburg',
    to: 'Graz',
    urgent: false
  },
  basket: {
    2: true,
    3: true,
    5: true,
  }
};

export const flightEntity = entityConfig({
  entity: type<Flight>(),
  collection: 'flight',
  // selectId: flight => flight.id
});


export const BookingStore = signalStore(
  // DI Config
  { providedIn: 'root' },
  // State
  withState(initialBookingState),
  withEntities(flightEntity),
  withComputed(store => ({
    delayed: () => store.flightEntities().filter(flight => flight.delayed),
  })),
  withProps(() => ({
    flightService: inject(FlightService)
  })),
  // Updater
  withMethods(store => ({
    setFilter: (filter: FlightFilter) => patchState(store, { filter }),
    updateBasket: (id: number, selected: boolean) => patchState(store, state => ({
      basket: {
        ...state.basket,
        [id]: selected
      }
    })),
    setFlights: (flights: Flight[]) =>
      patchState(store, setAllEntities(flights, flightEntity)),
    delayFlight: (id: number, addMin = 5) => patchState(store, updateEntity({ id, changes: flight => ({
      date: addMinutes(flight.date, addMin)
    })}, flightEntity)),
    resetFlights: () => patchState(store, removeAllEntities(flightEntity)),
  })),
  // Side-Effects
  withMethods(store => ({
    load: rxMethod<FlightFilter>(pipe(
      switchMap(filter => store.flightService.find(
        filter.from, filter.to, filter.urgent
      ).pipe(
        tapResponse({
          next: flights => store.setFlights(flights),
          error: err => console.error(err)
        })
      ))
    )),
  })),
  // Store Setup
  withHooks(store => ({
    onInit: () => store.load(store.filter)
  }))
);