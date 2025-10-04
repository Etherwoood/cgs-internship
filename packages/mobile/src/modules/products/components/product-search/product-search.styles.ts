import { StyleSheet } from 'react-native';
import { FONTS } from 'src/shared/styles';
import { COLORS } from 'src/shared/styles/colors';

export const styles = StyleSheet.create({
	container: {
		padding: 16,
		backgroundColor: COLORS.background,
		alignItems: 'center',
	},
	searchInput: {
		width: 361,
		height: 50,
		borderWidth: 1,
		borderColor: COLORS.border,
		borderRadius: 12,
		paddingHorizontal: 16,
		fontSize: 16,
		fontFamily: FONTS.PoppinsRegular,
		fontWeight: '400',
		lineHeight: 25.6,
		backgroundColor: COLORS.white,
		marginBottom: 10,
		color: COLORS.black,
	},
});
