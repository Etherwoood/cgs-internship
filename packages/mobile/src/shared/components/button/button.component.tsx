import React from 'react';
import {
	Pressable,
	Text,
	StyleSheet,
	ViewStyle,
	TextStyle,
} from 'react-native';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';

type ButtonProps = {
	title: string;
	onPress: () => void;
	disabled?: boolean;
	style?: ViewStyle;
	textStyle?: TextStyle;
	variant?: 'primary' | 'secondary' | 'outline';
	size?: 'small' | 'medium' | 'large';
};

export const Button: React.FC<ButtonProps> = ({
	title,
	onPress,
	disabled = false,
	style,
	textStyle,
	variant = 'primary',
	size = 'medium',
}) => {
	const buttonStyle = [
		styles.base,
		styles[variant],
		styles[size],
		disabled && styles.disabled,
		style,
	];

	const buttonTextStyle = [
		styles.text,
		styles[`${variant}Text`],
		styles[`${size}Text`],
		disabled && styles.disabledText,
		textStyle,
	];

	return (
		<Pressable
			style={({ pressed }) => [
				...buttonStyle,
				pressed && !disabled && styles.pressed,
			]}
			onPress={onPress}
			disabled={disabled}
		>
			<Text style={buttonTextStyle}>{title}</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	base: {
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},

	// Variants
	primary: {
		backgroundColor: COLORS.primary,
	},
	secondary: {
		backgroundColor: COLORS.secondary,
	},
	outline: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: COLORS.primary,
	},

	// Sizes
	small: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		minHeight: 32,
	},
	medium: {
		paddingVertical: 12,
		paddingHorizontal: 24,
		minHeight: 46,
		width: 361,
	},
	large: {
		paddingVertical: 16,
		paddingHorizontal: 32,
		minHeight: 56,
	},

	// States
	pressed: {
		backgroundColor: COLORS.primaryDark,
	},
	disabled: {
		backgroundColor: COLORS.border,
		opacity: 0.6,
	},

	// Text styles
	text: {
		fontFamily: FONTS.PoppinsBold,
		fontSize: 16,
		lineHeight: 26,
		letterSpacing: 0,
	},
	primaryText: {
		color: COLORS.white,
	},
	secondaryText: {
		color: COLORS.white,
	},
	outlineText: {
		color: COLORS.primary,
	},
	disabledText: {
		color: COLORS.textMuted,
	},

	// Text sizes
	smallText: {
		fontSize: 14,
		lineHeight: 22,
	},
	mediumText: {
		fontSize: 16,
		lineHeight: 26,
	},
	largeText: {
		fontSize: 18,
		lineHeight: 28,
	},
});
