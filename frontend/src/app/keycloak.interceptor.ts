import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import Keycloak from 'keycloak-js';
import { keycloak } from './keycloak.init'; 

export function keycloakInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
  const token = keycloak?.token;

  console.log('=== INTERCEPTOR CALLED ===');
  console.log('Request URL:', req.url);
  console.log('Token present:', !!token);
  console.log('Token (first 50 chars):', token?.substring(0, 50));

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    console.log('Authorization header added');
  } else {
    console.warn('⚠️ No token available - request will not have Authorization header');
  }
  return next(req);
}