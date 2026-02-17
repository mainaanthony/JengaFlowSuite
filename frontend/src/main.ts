import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { keycloakInterceptor } from './app/keycloak.interceptor';
import { APP_INITIALIZER } from '@angular/core';
import { APP_ROUTES} from '../src/app/app.routes'
import { initKeycloak } from './app/keycloak.init';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloClientOptions } from '@apollo/client/core';
import { inject } from '@angular/core';

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
    Apollo,
    {
      provide: APOLLO_OPTIONS,
      useFactory: (): ApolloClientOptions<any> => {
        const httpLink = inject(HttpLink);
        return {
          link: httpLink.create({
            uri: 'http://localhost:5001/graphql',
          }),
          cache: new InMemoryCache(),
          defaultOptions: {
            watchQuery: {
              fetchPolicy: 'cache-and-network',
              errorPolicy: 'all',
            },
            query: {
              fetchPolicy: 'network-only',
              errorPolicy: 'all',
            },
            mutate: {
              errorPolicy: 'all',
            },
          },
        };
      },
    },
    { provide: APP_INITIALIZER, useFactory: initKeycloak, multi: true },
  ]
}).catch(err => console.error(err));
