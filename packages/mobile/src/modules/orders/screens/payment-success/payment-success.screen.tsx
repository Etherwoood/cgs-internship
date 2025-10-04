import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { FONTS } from '../../../../shared/styles/fonts';
import { COLORS } from '../../../../shared/styles/colors';
import {
	NAVIGATION_KEYS,
	RootStackParamList,
} from '../../../navigation/types/navigation.type';
import CheckCircle from '../../../../../assets/images/check-circle.svg';
import CheckCircleSmall from '../../../../../assets/images/check-circle-small.svg';

export const PaymentSuccessScreen = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();

	const handleOk = () => {
		navigation.navigate(NAVIGATION_KEYS.MAIN_TABS, {
			screen: 'Orders',
		});
	};

	return (
		<View style={styles.screen}>
			<View style={styles.contentBlock}>
				<CheckCircle width={120} height={120} />
				<Text style={styles.successText}>Payment successful!</Text>
			</View>

			<View style={styles.actionsBlock}>
				<TouchableOpacity style={styles.okButton} onPress={handleOk}>
					<View style={styles.okButtonContent}>
						<CheckCircleSmall width={16} height={16} />
						<Text style={styles.okText}>Ok</Text>
					</View>
				</TouchableOpacity>
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
	okButton: {
		width: 361,
		height: 50,
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	okButtonContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	okText: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsBold,
		fontWeight: '700',
		color: COLORS.white,
	},
});
