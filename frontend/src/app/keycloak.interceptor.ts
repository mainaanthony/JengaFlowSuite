import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import Keycloak from 'keycloak-js';
import { keycloak } from './keycloak.init'; 

export function keycloakInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
  const token = keycloak?.token;

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
}