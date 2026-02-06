import { Injectable } from '@angular/core';

/**
 * Service for managing session storage
 */
@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  /**
   * Get an item from session storage
   */
  getItem<T>(key: string): T | null {
    const item = sessionStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item) as T;
      } catch (e) {
        console.error('Error parsing session storage item:', e);
        return null;
      }
    }
    return null;
  }

  /**
   * Set an item in session storage
   */
  setItem<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error setting session storage item:', e);
    }
  }

  /**
   * Remove an item from session storage
   */
  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  /**
   * Clear all session storage
   */
  clear(): void {
    sessionStorage.clear();
  }
}
