import * as React from 'react';
import {
	View,
	Text,
	Pressable,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FONTS } from '../../../../shared/styles/fonts';
import { COLORS } from '../../../../shared/styles/colors';
import { Button } from '../../../../shared/components/button';
import { SimpleInput } from '../../../../shared/components/input';
import {
	NAVIGATION_KEYS,
	RootStackParamList,
} from '../../../navigation/types/navigation.type';
import EyeOpened from '../../../../../assets/images/eye-opened.svg';
import EyeClosed from '../../../../../assets/images/eye-closed.svg';
import { authService } from '../../../../shared/services/auth.service';
import { RegisterRequest } from '../../../../shared/types/auth.types';
import {
	registerSchema,
	RegisterFormData,
} from '../../../../shared/schemas/auth.schemas';
import { useToast } from '../../../../shared/hooks/useToast';
import { useFormValidation } from '../../../../shared/hooks/useFormValidation';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const RegisterScreen = () => {
	const navigation = useNavigation<RegisterScreenNavigationProp>();
	const { showSuccess, showError } = useToast();
	const [showPassword, setShowPassword] = React.useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);

	const [formData, setFormData] = React.useState<RegisterFormData>({
		email: '',
		fullName: '',
		phoneNumber: '',
		shippingAddress: '',
		password: '',
		confirmPassword: '',
	});

	const { validateForm, getFieldError } = useFormValidation(registerSchema);

	const handleInputChange = (
		field: keyof RegisterFormData,
		value: string,
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSignUp = async () => {
		const isValid = validateForm(formData);

		if (!isValid) {
			showError('Please fix the validation errors');
			return;
		}

		setIsLoading(true);
		try {
			const registerData: RegisterRequest = {
				email: formData.email.trim(),
				password: formData.password.trim(),
				fullName: formData.fullName.trim(),
				phoneNumber: formData.phoneNumber.trim(),
				shippingAddress: formData.shippingAddress.trim(),
			};

			await authService.register(registerData);
			showSuccess(
				'Registration successful! Please check your email for verification code.',
			);

			navigation.navigate(NAVIGATION_KEYS.VERIFY, {
				email: formData.email.trim(),
			});
		} catch (error: unknown) {
			let errorMessage = 'Registration failed';

			if (error && typeof error === 'object' && 'response' in error) {
				const serverError = (error as { response: { data: unknown } })
					.response.data as {
					statusCode?: number;
					message?: string | string[];
				};

				if (
					serverError?.message &&
					Array.isArray(serverError.message)
				) {
					errorMessage = serverError.message.join('\n');
				} else if (
					serverError?.message &&
					typeof serverError.message === 'string'
				) {
					errorMessage = serverError.message;
				}

				if (serverError?.statusCode === 409) {
					errorMessage = 'User with this email already exists';
					showError('User with this email already exists');
				} else if (serverError?.statusCode === 400) {
					errorMessage =
						'Invalid data. Please check the filled fields';
					showError('Invalid data. Please check the filled fields');
				} else {
					showError('Invalid credentials');
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

	const handleSignIn = () => {
		navigation.navigate(NAVIGATION_KEYS.LOGIN);
	};

	const isFormValid = () => {
		return (
			formData.email.trim() !== '' &&
			formData.fullName.trim() !== '' &&
			formData.phoneNumber.trim() !== '' &&
			formData.shippingAddress.trim() !== '' &&
			formData.password.trim() !== '' &&
			formData.confirmPassword.trim() !== ''
		);
	};

	return (
		<KeyboardAvoidingView
			style={styles.screen}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<Text style={styles.title}>Sign Up</Text>
			<ScrollView
				style={styles.formBlock}
				contentContainerStyle={styles.formBlockContent}
				showsVerticalScrollIndicator={false}
			>
				<SimpleInput
					label="Email"
					placeholder="Email"
					placeholderTextColor={COLORS.placeholder}
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
					value={formData.email}
					onChangeText={(value) => handleInputChange('email', value)}
					error={getFieldError('email')}
				/>

				<SimpleInput
					label="Full name"
					placeholder="Full name"
					placeholderTextColor={COLORS.placeholder}
					value={formData.fullName}
					onChangeText={(value) =>
						handleInputChange('fullName', value)
					}
					error={getFieldError('fullName')}
				/>

				<SimpleInput
					label="Phone number"
					placeholder="Phone number"
					placeholderTextColor={COLORS.placeholder}
					keyboardType="phone-pad"
					value={formData.phoneNumber}
					onChangeText={(value) =>
						handleInputChange('phoneNumber', value)
					}
					error={getFieldError('phoneNumber')}
				/>

				<SimpleInput
					label="Shipping address"
					placeholder="Shipping address"
					placeholderTextColor={COLORS.placeholder}
					value={formData.shippingAddress}
					onChangeText={(value) =>
						handleInputChange('shippingAddress', value)
					}
					error={getFieldError('shippingAddress')}
				/>

				<View style={styles.passwordContainer}>
					<SimpleInput
						label="Password"
						placeholder="Password"
						placeholderTextColor={COLORS.placeholder}
						secureTextEntry={!showPassword}
						value={formData.password}
						onChangeText={(value) =>
							handleInputChange('password', value)
						}
						error={getFieldError('password')}
					/>
					<Pressable
						style={styles.passwordIconButton}
						hitSlop={10}
						onPress={() => setShowPassword(!showPassword)}
					>
						{showPassword ? (
							<EyeOpened width={20} height={20} />
						) : (
							<EyeClosed width={20} height={20} />
						)}
					</Pressable>
				</View>

				<View style={styles.passwordContainer}>
					<SimpleInput
						label="Confirm Password"
						placeholder="Confirm Password"
						placeholderTextColor={COLORS.placeholder}
						secureTextEntry={!showConfirmPassword}
						value={formData.confirmPassword}
						onChangeText={(value) =>
							handleInputChange('confirmPassword', value)
						}
						error={getFieldError('confirmPassword')}
					/>
					<Pressable
						style={styles.passwordIconButton}
						hitSlop={10}
						onPress={() =>
							setShowConfirmPassword(!showConfirmPassword)
						}
					>
						{showConfirmPassword ? (
							<EyeOpened width={20} height={20} />
						) : (
							<EyeClosed width={20} height={20} />
						)}
					</Pressable>
				</View>
			</ScrollView>
			<View style={styles.actionsBlock}>
				<Button
					title={isLoading ? 'Signing up...' : 'Sign Up'}
					onPress={handleSignUp}
					disabled={isLoading || !isFormValid()}
					variant={isFormValid() ? 'primary' : 'secondary'}
				/>

				<Text style={styles.signupRow}>
					Already have an account?{' '}
					<Text style={styles.signupLink} onPress={handleSignIn}>
						Sign In
					</Text>
				</Text>
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

	title: {
		marginTop: 40,
		textAlign: 'center',
		color: COLORS.text,
		fontFamily: FONTS.PoppinsBold,
		fontSize: 20,
		lineHeight: 30,
		letterSpacing: 0,
	},

	headerBlock: {
		marginTop: 77,
		marginHorizontal: 74,
		width: 280,
		height: 116.25,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	logo: {
		width: 43.22,
		height: 38.25,
	},
	brandText: {
		marginTop: 20,
		textAlign: 'center',
		color: COLORS.text,
		fontFamily: FONTS.KaushanScriptRegular,
		fontSize: 40,
		lineHeight: 58,
		width: 280,
		letterSpacing: 0,
	},

	formBlock: {
		marginTop: 30,
		marginHorizontal: 16,
		width: 361,
		alignSelf: 'center',
	},
	formBlockContent: {
		justifyContent: 'flex-start',
	},

	inputGroup: {
		marginBottom: 40,
		minHeight: 78,
	},
	passwordContainer: {
		position: 'relative',
	},
	passwordIconButton: {
		position: 'absolute',
		right: 18,
		top: 28,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1,
	},
	passwordIcon: {
		width: 20,
		height: 20,
	},

	actionsBlock: {
		marginTop: 49,
		marginHorizontal: 16,
		width: 361,
		height: 107,
		alignSelf: 'center',
		alignItems: 'center',
	},
	signupRow: {
		marginTop: 35,
		textAlign: 'center',
		color: COLORS.text,
		fontFamily: FONTS.InterRegular,
		fontSize: 16,
		lineHeight: 20,
		letterSpacing: 0,
	},
	signupLink: {
		fontFamily: FONTS.InterBold,
		color: COLORS.primary,
		fontSize: 16,
		lineHeight: 20,
	},
	passwordInputContainer: {
		flex: 1,
	},
	errorText: {
		marginTop: 6,
		color: COLORS.error,
		fontFamily: FONTS.InterMedium,
		fontSize: 12,
		lineHeight: 16,
		letterSpacing: 0,
	},
});
