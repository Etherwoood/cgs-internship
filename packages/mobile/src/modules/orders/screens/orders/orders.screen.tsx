import * as React from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	RefreshControl,
	TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { FONTS } from '../../../../shared/styles/fonts';
import { COLORS } from '../../../../shared/styles/colors';
import { Order } from '../../../../shared/types';
import { orderService } from '../../../../shared/services/order.service';
import {
	NAVIGATION_KEYS,
	RootStackParamList,
} from '../../../navigation/types/navigation.type';

export const OrdersScreen = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [orders, setOrders] = React.useState<Order[]>([]);
	const [refreshing, setRefreshing] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	const loadOrders = async () => {
		setLoading(true);
		try {
			const ordersData = await orderService.getOrders();
			setOrders(ordersData);
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	const handleOrderPress = (order: Order) => {
		navigation.navigate(NAVIGATION_KEYS.ORDER_DETAILS, { order });
	};

	const handleRefresh = async () => {
		setRefreshing(true);
		await loadOrders();
		setRefreshing(false);
	};

	const handleLoadMore = () => {};

	React.useEffect(() => {
		loadOrders();
	}, []);

	return (
		<View style={styles.screen}>
			<View style={styles.headerContainer}>
				<Text style={styles.title}>Orders</Text>
			</View>
			<View style={styles.searchContainer}></View>
			<FlatList
				data={orders}
				renderItem={({ item }) => (
					<View style={styles.cardContainer}>
						<TouchableOpacity
							style={styles.orderCard}
							onPress={() => handleOrderPress(item)}
						>
							<Text style={styles.orderId}>
								Order #{item.id.slice(0, 8)}
							</Text>
							<Text style={styles.orderStatus}>
								Payment: {item.paymentStatus} | Delivery:{' '}
								{item.deliveryStatus}
							</Text>
							<Text style={styles.orderTotal}>
								Total: ${item.totalAmount}
							</Text>
							<Text style={styles.orderDate}>
								{new Date(item.createdAt).toLocaleDateString()}
							</Text>
						</TouchableOpacity>
					</View>
				)}
				onEndReached={handleLoadMore}
				onEndReachedThreshold={0.5}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={handleRefresh}
					/>
				}
				keyExtractor={(item) => item.id}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={() => (
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>No orders found</Text>
					</View>
				)}
				ListFooterComponent={() => (
					<View style={styles.loadingContainer}>
						{loading ? (
							<Text style={styles.loadingText}>Loading...</Text>
						) : null}
					</View>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: COLORS.background,
		alignItems: 'center',
	},
	headerContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: 16,
		marginTop: 14,
		position: 'relative',
	},
	title: {
		textAlign: 'center',
		color: COLORS.text,
		fontFamily: FONTS.PoppinsBold,
		fontSize: 24,
		lineHeight: 36,
		letterSpacing: 0,
	},
	searchContainer: {
		width: '100%',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 50,
	},
	emptyText: {
		fontSize: 16,
		color: COLORS.text,
		fontFamily: FONTS.PoppinsRegular,
	},
	loadingContainer: {
		paddingVertical: 20,
		alignItems: 'center',
	},
	loadingText: {
		fontSize: 14,
		color: COLORS.text,
		fontFamily: FONTS.PoppinsRegular,
	},
	cardContainer: {
		marginBottom: 15,
	},
	orderCard: {
		width: 337,
		height: 120,
		backgroundColor: COLORS.white,
		borderRadius: 12,
		padding: 16,
		justifyContent: 'space-between',
	},
	orderId: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsBold,
		color: COLORS.text,
	},
	orderStatus: {
		fontSize: 12,
		fontFamily: FONTS.PoppinsRegular,
		color: COLORS.text,
		marginVertical: 4,
	},
	orderTotal: {
		fontSize: 14,
		fontFamily: FONTS.PoppinsSemiBold,
		color: COLORS.primary,
	},
	orderDate: {
		fontSize: 12,
		fontFamily: FONTS.PoppinsRegular,
		color: COLORS.text,
		opacity: 0.7,
	},
});
