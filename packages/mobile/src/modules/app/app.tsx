import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { Text, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

import { RootNavigator } from '../navigation/components/root-navigator';
import { COLORS } from '../../shared/styles/colors';
export const App = () => {
	const [fontsLoaded] = useFonts({
		'Poppins-Regular': require('../../../assets/fonts/Poppins-Regular.ttf'),
		'Poppins-SemiBold': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
		'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
		'Inter-Medium': require('../../../assets/fonts/Inter-medium.ttf'),
		'Inter-Bold': require('../../../assets/fonts/Inter-bold.ttf'),
		'KaushanScript-Regular': require('../../../assets/fonts/KaushanScript-Regular.ttf'),
	});

	if (!fontsLoaded) {
		return <Text />;
	}

	return (
		<GestureHandlerRootView style={styles.container}>
			<SafeAreaProvider>
				<RootNavigator />
				<Toast />
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
});
