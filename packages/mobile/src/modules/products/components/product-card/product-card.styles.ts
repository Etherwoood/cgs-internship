import { StyleSheet } from 'react-native';
import { FONTS } from 'src/shared/styles';
import { COLORS } from 'src/shared/styles/colors';

export const styles = StyleSheet.create({
	container: {
		width: 361,
		height: 82,
		padding: 10,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: 'gray',
		backgroundColor: COLORS.white,
	},
	topRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	productName: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsRegular,
		fontWeight: '400',
		lineHeight: 25.6,
		color: COLORS.text,
		flex: 1,
		marginRight: 10,
	},
	priceContainer: {
		flexDirection: 'row',
		alignItems: 'baseline',
	},
	priceLabel: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsBold,
		fontWeight: '700',
		lineHeight: 25.6,
		color: COLORS.text,
	},
	priceValue: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsRegular,
		fontWeight: '400',
		lineHeight: 25.6,
		color: COLORS.text,
	},
	categoryContainer: {
		marginTop: 10,
		flexDirection: 'row',
		alignItems: 'baseline',
	},
	categoryLabel: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsBold,
		fontWeight: '700',
		lineHeight: 25.6,
		color: COLORS.text,
	},
	categoryValue: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsRegular,
		fontWeight: '400',
		lineHeight: 25.6,
		color: COLORS.text,
	},
});
