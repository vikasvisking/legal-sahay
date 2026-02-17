import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthTokens } from '@/modules/authentication/types/auth.types';

interface UserState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;

    // Actions
    login: (user: User, tokens: AuthTokens) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            login: (user, tokens) => set({
                user,
                accessToken: tokens.access,
                refreshToken: tokens.refresh,
                isAuthenticated: true,
            }),

            logout: () => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },

            updateUser: (userData) => set((state) => ({
                user: state.user ? { ...state.user, ...userData } : null
            })),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Only persist these fields
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
