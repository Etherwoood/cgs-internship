import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NavContainer } from '../nav-container/nav-container.component';
import {
	NAVIGATION_KEYS,
	RootStackParamList,
} from '../../types/navigation.type';
import { SCREEN_OPTIONS } from '../../constants';
import { LoginScreen } from '../../../auth/screens/login/login.screen';
import { RegisterScreen } from '../../../auth/screens/register/register.screen';
import { VerifyScreen } from '../../../auth/screens/verify/verify.screen';
import { SuccessScreen } from '../../../auth/screens/success/success.screen';
import { TabNavigator } from '../tab-navigator';
import { ProductInformationScreen } from '../../../products/screens/product-information/product-information.screen';
import { CartScreen } from '../../../orders/screens/cart/cart.screen';
import { EditCartItemScreen } from '../../../orders/screens/edit-cart-item/edit-cart-item.screen';
import { OrderDetailsScreen } from '../../../orders/screens/order-details/order-details.screen';
import { PaymentSuccessScreen } from '../../../orders/screens/payment-success/payment-success.screen';
import { useAuthStore } from '../../../../shared/stores/auth.store';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
	const { isAuthenticated, isVerified } = useAuthStore();

	if (!isAuthenticated || !isVerified) {
		return (
			<NavContainer>
				<Stack.Navigator initialRouteName={NAVIGATION_KEYS.LOGIN}>
					<Stack.Screen
						name={NAVIGATION_KEYS.LOGIN}
						component={LoginScreen}
						options={SCREEN_OPTIONS}
					/>
					<Stack.Screen
						name={NAVIGATION_KEYS.REGISTER}
						component={RegisterScreen}
						options={SCREEN_OPTIONS}
					/>
					<Stack.Screen
						name={NAVIGATION_KEYS.VERIFY}
						component={VerifyScreen}
						options={SCREEN_OPTIONS}
					/>
					<Stack.Screen
						name={NAVIGATION_KEYS.SUCCESS}
						component={SuccessScreen}
						options={SCREEN_OPTIONS}
					/>
				</Stack.Navigator>
			</NavContainer>
		);
	}

	return (
		<NavContainer>
			<Stack.Navigator initialRouteName={NAVIGATION_KEYS.MAIN_TABS}>
				<Stack.Screen
					name={NAVIGATION_KEYS.MAIN_TABS}
					component={TabNavigator}
					options={SCREEN_OPTIONS}
				/>
				<Stack.Screen
					name={NAVIGATION_KEYS.PRODUCT_INFORMATION}
					component={ProductInformationScreen}
					options={SCREEN_OPTIONS}
				/>
				<Stack.Screen
					name={NAVIGATION_KEYS.CART}
					component={CartScreen}
					options={SCREEN_OPTIONS}
				/>
				<Stack.Screen
					name={NAVIGATION_KEYS.EDIT_CART_ITEM}
					component={EditCartItemScreen}
					options={SCREEN_OPTIONS}
				/>
				<Stack.Screen
					name={NAVIGATION_KEYS.ORDER_DETAILS}
					component={OrderDetailsScreen}
					options={SCREEN_OPTIONS}
				/>
				<Stack.Screen
					name={NAVIGATION_KEYS.PAYMENT_SUCCESS}
					component={PaymentSuccessScreen}
					options={SCREEN_OPTIONS}
				/>
			</Stack.Navigator>
		</NavContainer>
	);
};
