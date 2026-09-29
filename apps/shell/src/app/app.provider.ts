import { EnvironmentProviders, inject, InjectionToken, makeEnvironmentProviders, provideAppInitializer } from "@angular/core";
import { delay, of, tap } from "rxjs";

export const BASE_URL = new InjectionToken<string>('BASE_URL');

export function provideBaseUrl(url: string): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: BASE_URL,
      useValue: url
    }
  ]);
}

export function injectBaseUrl(suffix: string): string {
  return inject(BASE_URL) + suffix;
}

export function provideInitConfig(
  config: { username: string }
): EnvironmentProviders {
  return provideAppInitializer(
    () => of(config.username).pipe(
      tap(() => console.log('INIT')),
      delay(10_000),
      tap(username => console.log(username))
    )
  );
}