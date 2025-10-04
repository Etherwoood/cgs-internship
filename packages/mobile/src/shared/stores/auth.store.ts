import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserResponse, AuthResponse } from '../types/auth.types';

interface AuthState {
	isAuthenticated: boolean;
	isVerified: boolean;
	user: UserResponse | null;
	accessToken: string | null;
	refreshToken: string | null;
}

interface AuthActions {
	setAuth: (auth: Partial<AuthState>) => void;
	login: (authResponse: AuthResponse) => void;
	logout: () => void;
	verify: () => void;
	clearAuth: () => void;
	updateUser: (user: Partial<UserResponse>) => void;
}

const initialState: AuthState = {
	isAuthenticated: false,
	isVerified: false,
	user: null,
	accessToken: null,
	refreshToken: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
	persist(
		(set) => ({
			...initialState,
			setAuth: (auth) => set(auth),
			login: (authResponse) =>
				set({
					isAuthenticated: true,
					isVerified: authResponse.user.isVerified,
					user: authResponse.user,
					accessToken: authResponse.accessToken,
					refreshToken: null, // refreshToken пока не используется
				}),
			logout: () =>
				set({
					isAuthenticated: false,
					isVerified: false,
					user: null,
					accessToken: null,
					refreshToken: null,
				}),
			verify: () => set({ isVerified: true }),
			clearAuth: () => set(initialState),
			updateUser: (user) =>
				set((state) => ({
					user: state.user ? { ...state.user, ...user } : null,
				})),
		}),
		{
			name: 'auth-storage',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				isAuthenticated: state.isAuthenticated,
				isVerified: state.isVerified,
				user: state.user,
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
			}),
		},
	),
);
