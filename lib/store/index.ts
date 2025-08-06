import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { User } from '../types/common';

export interface AppState {
  sidebarOpen: boolean;

  user: User;

  currentApiKeyId: string | null;
}

export interface AppActions {
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  setUser: (user: Partial<AppState['user']>) => void;
  logout: () => void;

  setCurrentApiKeyId: (apiKeyId: string) => void;
}

export type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: false,
        openSidebar: () => set({ sidebarOpen: true }),
        closeSidebar: () => set({ sidebarOpen: false }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        user: {
          user_id: null,
          username: null,
          token: null,
        },
        setUser: (userData) =>
          set((state) => ({
            user: { ...state.user, ...userData },
          })),
        logout: () =>
          set({
            user: {
              user_id: null,
              username: null,
              token: null,
            },
          }),

        currentApiKeyId: null,
        setCurrentApiKeyId: (apiKeyId: string) => set({ currentApiKeyId: apiKeyId }),
      }),
      {
        name: 'app-store', // localStorage 的 key
        partialize: (state) => ({
          user: state.user,
          sidebarOpen: state.sidebarOpen,
          currentApiKeyId: state.currentApiKeyId,
        }),
      }
    ),
    {
      name: 'app-store', // name in Redux DevTools
    }
  )
);

export const useUser = () => useAppStore((state) => state.user);
export const useIsLogin = () => useAppStore((state) => state.user.token !== null);
