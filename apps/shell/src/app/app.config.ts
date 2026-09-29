import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideRouterFeature } from '@flight-demo/shared/state';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { APP_ROUTES } from './app.routes';
import { authInterceptor, provideAuthInterceptor } from '@flight-demo/shared/core';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideBaseUrl, provideInitConfig } from './app.provider';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(APP_ROUTES),
    provideHttpClient(      
      withInterceptorsFromDi()
    ),
    provideAuthInterceptor(),
    provideBaseUrl('https://demo.angulararchitects.io/api'),
    provideStore(),
    provideEffects(),
    provideRouterFeature(),
    provideStoreDevtools(),
    provideInitConfig({ username: 'mary.doe '})
  ]
};
