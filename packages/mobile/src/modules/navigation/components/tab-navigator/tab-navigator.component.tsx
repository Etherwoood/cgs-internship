import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FONTS } from '../../../../shared/styles/fonts';
import { COLORS } from '../../../../shared/styles/colors';
import { ProductsScreen } from '../../../products/screens/products/products.screen';
import { OrdersScreen } from '../../../orders/screens/orders/orders.screen';
import { SettingsScreen } from '../../../settings/screens/settings/settings.screen';

// Import SVG icons
import ProductsIcon from '../../../../../assets/images/products.svg';
import ProductsActiveIcon from '../../../../../assets/images/products-active.svg';
import OrdersIcon from '../../../../../assets/images/orders.svg';
import OrdersActiveIcon from '../../../../../assets/images/orders-active.svg';
import SettingsIcon from '../../../../../assets/images/settings.svg';
import SettingsActiveIcon from '../../../../../assets/images/settings-active.svg';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					height: 80,
					backgroundColor: COLORS.white,
					borderTopWidth: 1,
					borderTopColor: COLORS.border,
					paddingBottom: 10,
					paddingTop: 10,
				},
				tabBarLabelStyle: {
					fontFamily: FONTS.PoppinsRegular,
					fontSize: 14,
					lineHeight: 22,
					marginTop: 10,
				},
				tabBarActiveTintColor: COLORS.primary,
				tabBarInactiveTintColor: COLORS.black,
			}}
		>
			<Tab.Screen
				name="Products"
				component={ProductsScreen}
				options={{
					tabBarIcon: ({ focused }) =>
						focused ? (
							<ProductsActiveIcon width={24} height={24} />
						) : (
							<ProductsIcon width={24} height={24} />
						),
				}}
			/>
			<Tab.Screen
				name="Orders"
				component={OrdersScreen}
				options={{
					tabBarIcon: ({ focused }) =>
						focused ? (
							<OrdersActiveIcon width={24} height={24} />
						) : (
							<OrdersIcon width={24} height={24} />
						),
				}}
			/>
			<Tab.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					tabBarIcon: ({ focused }) =>
						focused ? (
							<SettingsActiveIcon width={24} height={24} />
						) : (
							<SettingsIcon width={24} height={24} />
						),
				}}
			/>
		</Tab.Navigator>
	);
};
