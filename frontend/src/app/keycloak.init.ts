import Keycloak, { KeycloakInstance } from 'keycloak-js';
import { inject } from '@angular/core';
import { UserRepository } from './core/domain/user/user.repository';
import { firstValueFrom } from 'rxjs';

export const keycloak = new (Keycloak as any)({
  url: 'http://localhost:8080',
  realm: 'dev',
  clientId: 'angular-app'
}) as KeycloakInstance;

export function initKeycloak(): () => Promise<boolean> {
  const userRepository = inject(UserRepository);
  
  return async () => {
    const authenticated = await keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256'
    });

    if (authenticated && keycloak.tokenParsed?.sub) {
      try {
        // Get the Keycloak user ID (sub claim)
        const keycloakId = keycloak.tokenParsed.sub;
        
        // Fetch the user from the database using the Keycloak ID
        const user = await firstValueFrom(userRepository.getUserByKeycloakId(keycloakId));
        
        // Set the current user in the repository
        if (user) {
          userRepository.setCurrentUser(user);
          console.log('Current user loaded:', user);
        } else {
          console.warn('User not found in database for Keycloak ID:', keycloakId);
        }
      } catch (error) {
        console.error('Error loading current user:', error);
      }
    }

    return authenticated;
  };
}
