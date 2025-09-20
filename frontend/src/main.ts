import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { keycloakInterceptor } from './app/keycloak.interceptor';
import { APP_INITIALIZER } from '@angular/core';
import { initKeycloak } from './app/keycloak.init';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([keycloakInterceptor])),
    { provide: APP_INITIALIZER, useFactory: initKeycloak, multi: true },
  ]
}).catch(err => console.error(err));
