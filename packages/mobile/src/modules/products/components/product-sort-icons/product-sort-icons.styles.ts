import { StyleSheet } from 'react-native';
import { FONTS } from 'src/shared/styles';
import { COLORS } from 'src/shared/styles/colors';

export const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: COLORS.background,
	},
	sortText: {
		fontSize: 14,
		fontFamily: FONTS.PoppinsRegular,
		color: COLORS.text,
		flex: 1,
	},
	iconsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8, // Space between icons
	},
	iconButton: {
		padding: 8,
		borderRadius: 8,
		backgroundColor: COLORS.white,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	activeIconButton: {
		backgroundColor: COLORS.primary,
		borderColor: COLORS.primary,
	},
	clearButton: {
		padding: 8,
		borderRadius: 8,
		backgroundColor: COLORS.white,
		borderWidth: 1,
		borderColor: COLORS.border,
		marginLeft: 4,
	},
});
