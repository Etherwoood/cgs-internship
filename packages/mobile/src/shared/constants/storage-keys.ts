export const STORAGE_KEYS = Object.freeze({
	ACCESS_TOKEN: 'access_token',
	REFRESH_TOKEN: 'refresh_token',
	USER_DATA: 'user_data',
	IS_LOGGED_IN: 'is_logged_in',
	IS_VERIFIED: 'is_verified',
	THEME: 'theme',
	LANGUAGE: 'language',
	PENDING_EMAIL: 'pending_email',
	VERIFICATION_ATTEMPTS: 'verification_attempts',
} as const);

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
