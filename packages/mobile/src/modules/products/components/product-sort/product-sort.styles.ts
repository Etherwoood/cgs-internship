import { StyleSheet } from 'react-native';
import { FONTS } from 'src/shared/styles';
import { COLORS } from 'src/shared/styles/colors';

export const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingVertical: 10,
	},
	sortButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: COLORS.background,
		borderWidth: 1,
		borderColor: COLORS.text,
	},
	activeButton: {
		backgroundColor: COLORS.primary,
		borderColor: COLORS.primary,
	},
	buttonText: {
		fontSize: 14,
		fontFamily: FONTS.PoppinsRegular,
		color: COLORS.text,
	},
	activeButtonText: {
		color: COLORS.background,
		fontWeight: 'bold',
	},
});
