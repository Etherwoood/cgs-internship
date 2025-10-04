import * as React from 'react';
import { Text, TextInput, View, TextInputProps } from 'react-native';
import { styles } from './input.styles';

interface SimpleInputProps extends TextInputProps {
	label?: string;
	error?: string;
	containerStyle?: object;
}

export const SimpleInput: React.FC<SimpleInputProps> = ({
	label,
	error,
	containerStyle,
	style,
	...props
}) => {
	const [isFocused, setIsFocused] = React.useState(false);

	return (
		<View
			style={[
				error ? styles.containerWithError : styles.container,
				containerStyle,
			]}
		>
			{label && <Text style={styles.label}>{label}</Text>}
			<TextInput
				{...props}
				onFocus={(e) => {
					setIsFocused(true);
					props.onFocus?.(e);
				}}
				onBlur={(e) => {
					setIsFocused(false);
					props.onBlur?.(e);
				}}
				style={[
					styles.input,
					isFocused && styles.focused,
					error && styles.inputError,
					style,
				]}
				autoCapitalize="none"
			/>
			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
};
