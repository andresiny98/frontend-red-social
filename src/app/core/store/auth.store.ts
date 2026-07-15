import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { RealtimeService } from '../services/realtime.service';
import { User } from '../models/user.model';

const STORAGE_KEY = 'red-social.auth';

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

function readFromStorage(): { user: User; token: string } | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user, token }) => ({
    isAuthenticated: computed(() => !!user() && !!token()),
  })),
  withMethods((store, realtimeService = inject(RealtimeService)) => ({
    setSession(token: string, user: User): void {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
      patchState(store, { user, token });
      realtimeService.connect(token);
    },

    logout(): void {
      localStorage.removeItem(STORAGE_KEY);
      realtimeService.disconnect();
      patchState(store, initialState);
    },

    hydrateFromStorage(): void {
      const stored = readFromStorage();
      if (stored) {
        patchState(store, { user: stored.user, token: stored.token });
        realtimeService.connect(stored.token);
      }
    },
  }))
);

// Permite inyectar AuthStore por constructor (`constructor(private authStore: AuthStore)`):
// signalStore() solo produce un binding de valor, así que aquí se le añade el tipo homónimo.
export interface AuthStore extends InstanceType<typeof AuthStore> {}
