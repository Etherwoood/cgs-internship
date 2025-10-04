import { useCallback } from 'react';
import Toast from 'react-native-toast-message';

export const useToast = () => {
	const showSuccess = useCallback((message: string) => {
		Toast.show({
			type: 'success',
			text1: 'Успешно',
			text2: message,
			position: 'top',
		});
	}, []);

	const showError = useCallback((message: string) => {
		Toast.show({
			type: 'error',
			text1: 'Error',
			text2: message,
			position: 'top',
			visibilityTime: 4000,
			autoHide: true,
		});
	}, []);

	const showInfo = useCallback((message: string) => {
		Toast.show({
			type: 'info',
			text1: 'Information',
			text2: message,
			position: 'top',
		});
	}, []);

	return {
		showSuccess,
		showError,
		showInfo,
	};
};
