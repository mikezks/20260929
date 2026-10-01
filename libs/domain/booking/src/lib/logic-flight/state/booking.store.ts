import { inject, linkedSignal } from '@angular/core';
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
  _filter: FlightFilter;
  basket: Record<number, boolean>;
}

export const initialBookingState: BookingState = {
  _filter: {
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
    _flightService: inject(FlightService)
  })),
  // Updater
  withMethods(store => ({
    _setFilter: (filter: FlightFilter) => patchState(store, { _filter: filter }),
    _updateBasket: (id: number, selected: boolean) => patchState(store, state => ({
      basket: {
        ...state.basket,
        [id]: selected
      }
    })),
    setFlights: (flights: Flight[]) =>
      patchState(store, setAllEntities(flights, flightEntity)),
    _delayFlight: (id: number, addMin = 5) => patchState(store, updateEntity({ id, changes: flight => ({
      date: addMinutes(flight.date, addMin)
    })}, flightEntity)),
    resetFlights: () => patchState(store, removeAllEntities(flightEntity)),
  })),
  withProps(store => ({
    writableFilter: linkedSignal(
      store._filter,
      { set: store._setFilter }
    ),
    writableFlightSelect: (id: number) => linkedSignal(
      () => store.basket()[id],
      { set: (selected: boolean) => store._updateBasket(id, selected) }
    ),
    writableFlight: (id: number) => linkedSignal(
      () => store.flightEntityMap()[id],
      { set: () => store._delayFlight(id) }
    ),
  })),
  // Side-Effects
  withMethods(store => ({
    _load: rxMethod<FlightFilter>(pipe(
      switchMap(filter => store._flightService.find(
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
    onInit: () => store._load(store._filter)
  }))
);