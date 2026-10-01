import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, numberAttribute, signal } from '@angular/core';
import { apply, createMetadataKey, form, FormField, FormRoot, metadata, required, schema, SchemaPath, validate } from '@angular/forms/signals';
import { Address, AddressControl, addressSchema, initialAddress } from '@flight-demo/shared/core';
import { RouterLink } from '@angular/router';
import { initialPassenger, Passenger } from '../../logic-passenger/model/passenger';


const ALLOWED_LASTNAMES = createMetadataKey<string[]>();

export function validateLastname(
  field: SchemaPath<string>,
  message: string
): void {
  validate(field, ({ value, state }) => {
    const allowedLastnames = state.metadata(ALLOWED_LASTNAMES)?.() || [];
    return allowedLastnames.includes(value())
      ? null
      : {
        kind: 'forbiddenLastname',
        message: message + ' Enter one of those Lastnames: '
          + allowedLastnames.join(', ')
      }
    }
  );
}

// (3) Field Logic: Validators, Conditional readonly, disabled, ...
export const passengerSchema = schema<{
  passenger: Passenger
  address: Address
}>(passengerPath => {
  metadata(passengerPath.passenger.name, ALLOWED_LASTNAMES, () => [
    'Smith', 'Williams', 'Brown', 'Jones'
  ]);
  required(passengerPath.passenger.name, {
    message: 'The lastname is mandatory - please enter a value.'
  });
  validateLastname(passengerPath.passenger.name, 'This Lastname is not allowed.');
  apply(passengerPath.address, addressSchema)
});


@Component({
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- preserves the workshop's pre-v22 behavior
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-passenger-edit',
  imports: [
    RouterLink,
    // (4) UI Control: Template Binding
    FormField, FormRoot,
    AddressControl
  ],
  templateUrl: './passenger-edit.component.html'
})
export class PassengerEditComponent {
  // (1) Data Model: Writable Signal
  protected readonly passengerResource = httpResource<Passenger>(
    () => `https://demo.angulararchitects.io/api/passenger?id=${ this.id() }`,
    { defaultValue: initialPassenger }
  );
  protected readonly passengerWithAddress = linkedSignal(() => ({
    passenger: this.passengerResource.hasValue()
      ? this.passengerResource.value()
      : initialPassenger,
    address: initialAddress
  }), {
    set: (passengerWithAddress, rawSetter) => {
      this.passengerResource.set(passengerWithAddress.passenger);
      rawSetter(passengerWithAddress);
    }
  });

  // (2) Field State: valid, value, dirty, ...
  protected readonly editForm = form(
    this.passengerWithAddress,
    passengerSchema,
    {
      submission: {
        action: async () => this.save()
      }
    }
  );

  readonly id = input(0, { transform: numberAttribute });

  protected readonly allowedLastnames = computed(
    () => this.editForm.passenger.name().metadata(ALLOWED_LASTNAMES)?.()?.join(', ') || ''
  );

  protected save(): void {
    console.log(this.editForm().value());
    console.log(this.passengerWithAddress());
    console.log(this.passengerResource.value());
  }
}
