import { StyleSheet } from 'react-native';
import { FONTS } from '../../styles/fonts';

export const styles = StyleSheet.create({
	container: {
		position: 'relative',
		marginBottom: 40,
		minHeight: 78,
	},
	containerWithError: {
		position: 'relative',
		marginBottom: 14,
		minHeight: 106,
	},
	input: {
		width: '100%',
		height: 50,
		paddingHorizontal: 16,
		fontSize: 16,
		fontFamily: FONTS.PoppinsRegular,
		lineHeight: 26,
		borderWidth: 1,
		borderRadius: 10,
		borderColor: '#E0E0E0',
		backgroundColor: '#FFFFFF',
	},
	label: {
		marginBottom: 6,
		fontSize: 14,
		fontFamily: FONTS.InterMedium,
		color: '#777777',
		lineHeight: 22,
	},
	focused: {
		borderColor: '#007AFF',
		borderWidth: 1,
	},
	wrong: {
		borderColor: '#FF0000',
		borderWidth: 1,
	},
	correct: {
		borderColor: '#00C851',
		borderWidth: 1,
	},
	inputError: {
		borderColor: '#FF0000',
		borderWidth: 1,
	},
	errorText: {
		color: '#FF0000',
		fontSize: 14,
		fontFamily: FONTS.InterMedium,
		lineHeight: 22,
		marginTop: 6,
	},
});
