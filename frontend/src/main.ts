import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { keycloakInterceptor } from './app/keycloak.interceptor';
import { APP_INITIALIZER } from '@angular/core';
import { APP_ROUTES} from '../src/app/app.routes'
import { initKeycloak } from './app/keycloak.init';
import { provideRouter, withComponentInputBinding } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withInterceptors([keycloakInterceptor])),
    { provide: APP_INITIALIZER, useFactory: initKeycloak, multi: true },
  ]
}).catch(err => console.error(err));
