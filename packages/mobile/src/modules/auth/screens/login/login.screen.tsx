import * as React from 'react';
import {
	View,
	Text,
	Image,
	Pressable,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
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
import { useAuthStore } from '../../../../shared/stores/auth.store';
import { LoginRequest } from '../../../../shared/types/auth.types';
import {
	loginSchema,
	LoginFormData,
} from '../../../../shared/schemas/auth.schemas';
import { useToast } from '../../../../shared/hooks/useToast';
import { useFormValidation } from '../../../../shared/hooks/useFormValidation';

import logoImg from '../../../../../assets/images/logo.png';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const LoginScreen = () => {
	const navigation = useNavigation<LoginScreenNavigationProp>();
	const { login } = useAuthStore();
	const { showSuccess, showError } = useToast();
	const [showPassword, setShowPassword] = React.useState(false);
	const [formData, setFormData] = React.useState<LoginFormData>({
		email: '',
		password: '',
	});
	const [isLoading, setIsLoading] = React.useState(false);

	const { validateForm, getFieldError } = useFormValidation(loginSchema);

	const handleInputChange = (field: keyof LoginFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSignIn = async () => {
		const isValid = validateForm(formData);

		if (!isValid) {
			showError('Please fix the validation errors');
			return;
		}

		setIsLoading(true);
		try {
			const loginData: LoginRequest = {
				email: formData.email.trim(),
				password: formData.password.trim(),
			};
			const response = await authService.login(loginData);
			login(response);
			showSuccess('Login successful!');
		} catch (error: unknown) {
			let errorMessage = 'Login failed';
			let showToast = true;

			if (error && typeof error === 'object' && 'response' in error) {
				const serverError = (error as { response: { data: unknown } })
					.response.data as { statusCode?: number; message?: string };

				if (serverError?.statusCode === 401) {
					errorMessage = 'Invalid credentials';
					showError('Invalid credentials');
					showToast = false;
				} else if (serverError?.statusCode === 403) {
					errorMessage =
						'Account not verified. Please check your email';
					showError('Account not verified. Please check your email');
					showToast = false;
				} else if (serverError?.statusCode === 404) {
					errorMessage = 'User not found';
					showError('User not found');
					showToast = false;
				} else if (serverError?.message) {
					errorMessage = serverError.message;
					showError(serverError.message);
					showToast = false;
				}
			} else if (
				error &&
				typeof error === 'object' &&
				'message' in error
			) {
				errorMessage = (error as { message: string }).message;
			}

			if (showToast) {
				showError(errorMessage);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignUp = () => {
		navigation.navigate(NAVIGATION_KEYS.REGISTER);
	};

	return (
		<KeyboardAvoidingView
			style={styles.screen}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<View style={styles.headerBlock}>
				<Image
					source={logoImg}
					style={styles.logo}
					resizeMode="contain"
				/>
				<Text style={styles.brandText}>Awesome Store</Text>
			</View>

			<View style={styles.formBlock}>
				<SimpleInput
					label="Email"
					placeholder="Email"
					placeholderTextColor="#999999"
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
					value={formData.email}
					onChangeText={(value) => handleInputChange('email', value)}
					error={getFieldError('email')}
				/>

				<View style={styles.passwordContainer}>
					<SimpleInput
						label="Password"
						placeholder="Password"
						placeholderTextColor="#999999"
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
			</View>

			<View style={styles.actionsBlock}>
				<Button
					title={isLoading ? 'Signing in...' : 'Sign In'}
					onPress={handleSignIn}
					disabled={isLoading}
				/>

				<Text style={styles.signupRow}>
					Don't have an account?{' '}
					<Text style={styles.signupLink} onPress={handleSignUp}>
						Sign Up
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
		marginTop: 20.75,
		marginHorizontal: 16,
		width: 361,
		height: 224,
		alignSelf: 'center',
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
		marginTop: 295,
		marginHorizontal: 16,
		width: 361,
		height: 107,
		alignSelf: 'center',
		alignItems: 'center',
	},
	signupRow: {
		marginTop: 40,
		textAlign: 'center',
		color: COLORS.black,
		fontFamily: FONTS.PoppinsRegular,
		fontSize: 16,
		lineHeight: 20,
		letterSpacing: 0,
	},
	signupLink: {
		fontFamily: FONTS.PoppinsBold,
		color: COLORS.primary,
		fontSize: 16,
		lineHeight: 20,
	},
});
