import * as React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation as _useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FONTS } from '../../../../shared/styles/fonts';
import { COLORS } from '../../../../shared/styles/colors';
import { RootStackParamList } from '../../../navigation/types/navigation.type';
import { useAuthStore } from '../../../../shared/stores/auth.store';

export const SettingsScreen = () => {
	const { logout } = useAuthStore();

	const handlePersonalInfo = () => {};

	const handleChangePassword = () => {};

	const handleFAQ = () => {};

	const handleTermsConditions = () => {};

	const handleLogout = () => {
		logout();
	};

	return (
		<View style={styles.screen}>
			<Text style={styles.title}>Settings</Text>
			<View style={styles.menuContainer}>
				<Pressable style={styles.menuItem} onPress={handlePersonalInfo}>
					<Text style={styles.menuItemText}>Personal info</Text>
				</Pressable>
				<Pressable
					style={styles.menuItem}
					onPress={handleChangePassword}
				>
					<Text style={styles.menuItemText}>Change password</Text>
				</Pressable>
				<Pressable style={styles.menuItem} onPress={handleFAQ}>
					<Text style={styles.menuItemText}>FAQ</Text>
				</Pressable>
				<Pressable
					style={styles.menuItem}
					onPress={handleTermsConditions}
				>
					<Text style={styles.menuItemText}>Terms & Conditions</Text>
				</Pressable>
				<Pressable style={styles.menuItem} onPress={handleLogout}>
					<Text style={styles.logoutText}>Logout</Text>
				</Pressable>
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
	title: {
		marginTop: 14,
		textAlign: 'center',
		color: COLORS.text,
		fontFamily: FONTS.PoppinsBold,
		fontSize: 24,
		lineHeight: 36,
		letterSpacing: 0,
	},
	menuContainer: {
		marginTop: 22,
		marginLeft: 26,
		width: 156,
		height: 210,
		alignSelf: 'flex-start',
	},
	menuItem: {
		width: 156,
		height: 26,
		justifyContent: 'center',
		marginBottom: 20,
	},
	menuItemText: {
		fontFamily: FONTS.PoppinsRegular,
		fontSize: 16,
		lineHeight: 26,
		color: COLORS.black,
		letterSpacing: 0,
	},
	logoutText: {
		fontFamily: FONTS.PoppinsRegular,
		fontSize: 16,
		lineHeight: 26,
		color: COLORS.error,
		letterSpacing: 0,
	},
});
