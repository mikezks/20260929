import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, input, linkedSignal, numberAttribute, signal } from '@angular/core';
import { apply, form, FormField, FormRoot, required, schema, SchemaPath, validate } from '@angular/forms/signals';
import { Address, AddressControl, addressSchema, initialAddress } from '@flight-demo/shared/core';
import { RouterLink } from '@angular/router';
import { initialPassenger, Passenger } from '../../logic-passenger/model/passenger';


export function validateLastname(
  field: SchemaPath<string>,
  allowedLastnames: string[],
  message: string
): void {
  validate(field, ({ value }) => allowedLastnames.includes(value())
    ? null
    : {
      kind: 'forbiddenLastname',
      message: message + ' Enter one of those Lastnames: '
        + allowedLastnames.join(', ')
    }
  );
}

// (3) Field Logic: Validators, Conditional readonly, disabled, ...
export const passengerSchema = schema<{
  passenger: Passenger
  address: Address
}>(passengerPath => {
  required(passengerPath.passenger.name, {
    message: 'The lastname is mandatory - please enter a value.'
  });
  validateLastname(passengerPath.passenger.name, [
    'Smith', 'Williams', 'Brown', 'Jones'
  ], 'This Lastname is not allowed.');
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
    passenger: this.passengerResource.value(),
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

  protected save(): void {
    console.log(this.editForm().value());
    console.log(this.passengerWithAddress());
    console.log(this.passengerResource.value());
  }
}
