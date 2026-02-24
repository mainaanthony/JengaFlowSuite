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
        // Get current user from backend (auto-provisions if doesn't exist)
        // Backend extracts user info from JWT token and creates user if needed
        const user = await firstValueFrom(userRepository.loadCurrentUserFromServer());
        
        // Set the current user in the repository
        if (user) {
          userRepository.setCurrentUser(user);
          console.log('Current user loaded:', user);
        } else {
          console.warn('Unable to load user from backend');
        }
      } catch (error) {
        console.error('Error loading current user:', error);
      }
    }

    return authenticated;
  };
}
