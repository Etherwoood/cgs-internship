import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { FONTS } from '../../../../shared/styles/fonts';
import { COLORS } from '../../../../shared/styles/colors';
import { Button } from '../../../../shared/components/button';
import CheckCircle from '../../../../../assets/images/check-circle.svg';
import { useAuthStore } from '../../../../shared/stores/auth.store';
import { AuthResponse } from '../../../../shared/types/auth.types';

export const SuccessScreen = () => {
	const route = useRoute();
	const { login } = useAuthStore();

	const handleSignIn = () => {
		const { userData } = route.params as { userData?: AuthResponse };
		if (userData) {
			login(userData);
		}
	};

	return (
		<View style={styles.screen}>
			<View style={styles.contentBlock}>
				<CheckCircle width={120} height={120} />
				<Text style={styles.successText}>
					Account successfully registered!
				</Text>
			</View>

			<View style={styles.actionsBlock}>
				<Button title="Sign In" onPress={handleSignIn} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: COLORS.background,
		alignItems: 'center',
	},

	contentBlock: {
		marginTop: 260,
		width: 259,
		height: 166,
		alignItems: 'center',
		alignSelf: 'center',
	},
	successText: {
		marginTop: 20,
		textAlign: 'center',
		color: COLORS.text,
		fontFamily: FONTS.PoppinsRegular,
		fontSize: 16,
		lineHeight: 26,
		letterSpacing: 0,
	},

	actionsBlock: {
		marginTop: 353,
		marginHorizontal: 16,
		width: 361,
		alignSelf: 'center',
		alignItems: 'center',
	},
});
