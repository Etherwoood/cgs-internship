import * as React from 'react';
import {
	View,
	Text,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FONTS } from '../../../../shared/styles/fonts';
import { COLORS } from '../../../../shared/styles/colors';
import { Button } from '../../../../shared/components/button';
import {
	RootStackParamList,
	NAVIGATION_KEYS,
} from '../../../navigation/types/navigation.type';
import {
	CodeField,
	Cursor,
	useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { authService } from '../../../../shared/services/auth.service';
import { VerifyEmailRequest } from '../../../../shared/types/auth.types';
import {
	verifyEmailSchema,
	VerifyEmailFormData,
} from '../../../../shared/schemas/auth.schemas';
import { useToast } from '../../../../shared/hooks/useToast';
import { useFormValidation } from '../../../../shared/hooks/useFormValidation';

type _VerifyScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const VerifyScreen = () => {
	const route = useRoute();
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
	const { showSuccess, showError } = useToast();
	const { email } = route.params as { email: string };
	const CELL_COUNT = 4;
	const [value, setValue] = React.useState('');
	const [isLoading, setIsLoading] = React.useState(false);
	const [props, getCellOnLayoutHandler] = useClearByFocusCell({
		value,
		setValue,
	});

	const { validateForm, getFieldError } =
		useFormValidation(verifyEmailSchema);

	const handleVerify = async () => {
		const formData: VerifyEmailFormData = { email, code: value };
		if (!validateForm(formData)) {
			showError('Please fix the validation errors');
			return;
		}

		setIsLoading(true);
		try {
			const verifyData: VerifyEmailRequest = {
				email,
				code: value,
			};

			const response = await authService.verifyEmail(verifyData);
			navigation.navigate(NAVIGATION_KEYS.SUCCESS, {
				userData: response,
			});
		} catch (error: unknown) {
			let errorMessage = 'Verification failed';

			if (error && typeof error === 'object' && 'response' in error) {
				const serverError = (error as { response: { data: unknown } })
					.response.data as { statusCode?: number; message?: string };

				if (serverError?.statusCode === 400) {
					errorMessage = 'Invalid verification code';
					showError('Invalid code');
				} else if (serverError?.statusCode === 404) {
					errorMessage = 'User not found';
					showError('User not found');
				} else if (serverError?.statusCode === 410) {
					errorMessage = 'Code expired. Please request a new code';
					showError('Code expired. Please request a new code');
				} else if (serverError?.message) {
					errorMessage = serverError.message;
					showError(serverError.message);
				}
			} else if (
				error &&
				typeof error === 'object' &&
				'message' in error
			) {
				errorMessage = (error as { message: string }).message;
			}

			showError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const _handleResend = async () => {
		try {
			await authService.resendCode({ email });
			showSuccess('Code sent successfully to your email');
		} catch (error: unknown) {
			showError(
				(error as { response?: { data?: { message?: string } } })
					?.response?.data?.message || 'Failed to resend code',
			);
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.screen}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<Text style={styles.screenTitle}>Email Verification</Text>

			<View style={styles.infoContainer}>
				<Text style={styles.infoText}>
					Please type the code from the email
				</Text>
				<View style={styles.codeRowWrapper}>
					<CodeField
						InputComponent={TextInput}
						{...props}
						value={value}
						onChangeText={setValue}
						cellCount={CELL_COUNT}
						rootStyle={styles.codeFieldRoot}
						keyboardType="number-pad"
						textContentType="oneTimeCode"
						renderCell={({
							index,
							symbol,
							isFocused,
						}: {
							index: number;
							symbol: string;
							isFocused: boolean;
						}) => (
							<View
								key={index}
								onLayout={getCellOnLayoutHandler(index)}
								style={[
									styles.codeCell,
									isFocused && styles.codeCellFocused,
									getFieldError('code') &&
										styles.codeCellError,
								]}
							>
								<Text style={styles.codeCellText}>
									{symbol || (isFocused ? <Cursor /> : '')}
								</Text>
							</View>
						)}
					/>
				</View>
				{getFieldError('code') && (
					<Text style={styles.errorText}>
						{getFieldError('code')}
					</Text>
				)}
			</View>

			<View style={styles.actionsBlock}>
				<Button
					title={isLoading ? 'Verifying...' : 'Verify'}
					onPress={handleVerify}
					disabled={isLoading}
				/>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: COLORS.background,
		alignItems: 'center',
	},

	screenTitle: {
		marginTop: 77,
		textAlign: 'center',
		color: COLORS.text,
		fontFamily: FONTS.PoppinsBold,
		fontSize: 20,
		lineHeight: 30,
		letterSpacing: 0,
	},

	infoContainer: {
		marginTop: 40,
		width: 241,
		height: 121,
		alignItems: 'center',
		alignSelf: 'center',
	},
	infoText: {
		textAlign: 'center',
		color: COLORS.textMuted,
		fontFamily: FONTS.InterMedium,
		fontSize: 14,
		lineHeight: 26,
		width: 245,
		flexWrap: 'nowrap',
	},
	codeRowWrapper: {
		marginTop: 49,
		width: 241,
		alignItems: 'center',
	},
	codeFieldRoot: {
		width: 206,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	codeCell: {
		width: 44,
		height: 50,
		borderWidth: 1,
		borderColor: COLORS.border,
		borderRadius: 8,
		backgroundColor: COLORS.white,
		alignItems: 'center',
		justifyContent: 'center',
	},
	codeCellFocused: {
		borderColor: COLORS.primary,
	},
	codeCellError: {
		borderColor: COLORS.error,
	},
	codeCellText: {
		fontFamily: FONTS.PoppinsBold,
		fontSize: 20,
		color: COLORS.text,
	},
	errorText: {
		marginTop: 6,
		color: COLORS.error,
		fontFamily: FONTS.InterMedium,
		fontSize: 12,
		lineHeight: 16,
		letterSpacing: 0,
		textAlign: 'center',
	},

	actionsBlock: {
		marginTop: 515,
		marginHorizontal: 16,
		width: 361,
		alignSelf: 'center',
		alignItems: 'center',
	},
});
