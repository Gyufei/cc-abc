import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface AppState {
  sidebarOpen: boolean;

  user: {
    id: string | null;
    name: string | null;
    email: string | null;
    isAuthenticated: boolean;
  };
}

export interface AppActions {
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  setUser: (user: Partial<AppState['user']>) => void;
  logout: () => void;
}

export type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        sidebarOpen: false,
        openSidebar: () => set({ sidebarOpen: true }),
        closeSidebar: () => set({ sidebarOpen: false }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        user: {
          id: null,
          name: null,
          email: null,
          isAuthenticated: false,
        },

        setUser: (userData) =>
          set((state) => ({
            user: { ...state.user, ...userData },
          })),

        logout: () =>
          set({
            user: {
              id: null,
              name: null,
              email: null,
              isAuthenticated: false,
            },
          }),
      }),
      {
        name: 'app-store', // localStorage 的 key
        partialize: (state) => ({
          user: state.user,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'app-store', // name in Redux DevTools
    }
  )
);

export const useUser = () => useAppStore((state) => state.user);

export const isUserLogin = (state: AppState) => state.user.isAuthenticated;
