import Keycloak, { KeycloakInstance } from 'keycloak-js';
import { inject } from '@angular/core';
import { UserRepository } from './core/domain/user/user.repository';
import { firstValueFrom } from 'rxjs';
import { Apollo } from 'apollo-angular';

export const keycloak = new (Keycloak as any)({
  url: 'http://localhost:8080',
  realm: 'dev',
  clientId: 'angular-app'
}) as KeycloakInstance;

export function initKeycloak(): () => Promise<boolean> {
  const userRepository = inject(UserRepository);
  const apollo = inject(Apollo);
  
  return async () => {
    const authenticated = await keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256'
    });

    if (authenticated && keycloak.tokenParsed?.sub) {
      try {
        console.log('=== KEYCLOAK AUTHENTICATION ===');
        console.log('Keycloak ID:', keycloak.tokenParsed.sub);
        console.log('Username:', keycloak.tokenParsed.preferred_username);
        
        // Clear Apollo cache to prevent stale data
        await apollo.client.clearStore();
        console.log('Apollo cache cleared');
        
        // Get current user from backend (auto-provisions if doesn't exist)
        // Backend extracts user info from JWT token and creates user if needed
        console.log('Loading user from server...');
        const user = await firstValueFrom(userRepository.loadCurrentUserFromServer());
        
        // Set the current user in the repository
        if (user) {
          userRepository.setCurrentUser(user);
          console.log('✅ Current user loaded successfully:', user);
        } else {
          console.warn('⚠️ Unable to load user from backend');
        }
      } catch (error: any) {
        console.error('❌ Error loading current user:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.graphQLErrors) {
          console.error('GraphQL Errors:', error.graphQLErrors);
        }
        if (error.networkError) {
          console.error('Network Error:', error.networkError);
        }
      }
    }

    return authenticated;
  };
}
