import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { keycloakInterceptor } from './app/keycloak.interceptor';
import { APP_INITIALIZER } from '@angular/core';
import { APP_ROUTES} from '../src/app/app.routes'
import { initKeycloak } from './app/keycloak.init';
import { provideRouter, withComponentInputBinding } from '@angular/router';

// Handle chunk loading errors (typically caused by cache issues after deployment)
window.addEventListener('error', (event) => {
  const target = event.target as any;
  const isChunkLoadError = target?.src?.includes('.js') || 
                          event.message?.includes('Loading chunk') ||
                          event.message?.includes('ChunkLoadError');
  
  if (isChunkLoadError) {
    const hasReloaded = sessionStorage.getItem('chunk-reload');
    if (!hasReloaded) {
      sessionStorage.setItem('chunk-reload', 'true');
      window.location.reload();
    } else {
      sessionStorage.removeItem('chunk-reload');
      console.error('Chunk loading failed after reload. Please clear your browser cache.');
    }
  }
}, true);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withInterceptors([keycloakInterceptor])),
    { provide: APP_INITIALIZER, useFactory: initKeycloak, multi: true },
  ]
}).catch(err => console.error(err));
