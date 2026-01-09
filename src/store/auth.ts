import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IAuthStore, IUser } from 'types';
import { AuthApis } from 'services';
import { fcmTokenGenerator, dataExtractor } from 'utils';

const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user: IUser | null) => set({ user }),

      access_token: null,
      setAccessToken: (access_token: string | null) => set({ access_token }),

      // refresh_token: null,
      // setRefrechToken: (refresh_token: string) => set({ refresh_token }),

      // expires_in: null,
      // expires_at: null,

      isOnBoarded: false,
      setIsOnBoarded: (value: boolean) => set({ isOnBoarded: value }),

      isStoreReady: false,
      setIsStoreReady: (value: boolean) => set({ isStoreReady: value }),

      isLoggedIn: false,
      setIsLoggedIn: (value: boolean) => set({ isLoggedIn: value }),

      logout: async () => {
        try {
          const fcmToken = await fcmTokenGenerator();
          await AuthApis.logout({ fcm_token: fcmToken });
          set({ user: null });
          set({ access_token: null });
          set({ isLoggedIn: false });
        } catch (e) {
          set({ user: null });
          set({ access_token: null });
          set({ isLoggedIn: false });
        }
      },
      deleteAccount: async () => {
        try {
          const fcmToken = await fcmTokenGenerator();
          await AuthApis.deleteAccount({ fcm_token: fcmToken });
          set({ user: null });
          set({ access_token: null });
          set({ isLoggedIn: false });
        } catch (e) {
          // Even if API call fails, clear local state
          set({ user: null });
          set({ access_token: null });
          set({ isLoggedIn: false });
          throw e;
        }
      },
      refreshUser: async () => {
        try {
          const { isLoggedIn } = get();
          if (!isLoggedIn) {
            return;
          }
          const response = await AuthApis.getCurrentUser();
          const userData = dataExtractor<IUser>(response);
          if (userData) {
            set({ user: userData });
          }
        } catch (e) {
          console.log('Failed to refresh user data:', e);
          // Don't throw error, just log it
        }
      },
    }),
    {
      name: 'user-storage', // storage key
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        state?.setIsStoreReady(true);
      },
    },
  ),
);

export default useAuthStore;
