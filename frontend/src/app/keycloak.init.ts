import Keycloak, { KeycloakInstance } from 'keycloak-js';

export const keycloak = new (Keycloak as any)({
  url: 'http://localhost:8080',
  realm: 'dev',
  clientId: 'angular-app'
}) as KeycloakInstance;

export function initKeycloak(): () => Promise<boolean> {
  return () =>
    keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256'
    });
}
