import * as React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { FONTS } from '../../../../shared/styles/fonts';
import { COLORS } from '../../../../shared/styles/colors';
import {
	NAVIGATION_KEYS,
	RootStackParamList,
} from '../../../navigation/types/navigation.type';
import {
	Order,
	OrderDetail,
	Product,
} from '../../../../shared/types/order.types';
import { orderService } from '../../../../shared/services/order.service';
import LeftArrowIcon from '../../../../../assets/images/left-arrow.svg';
import PaymentIcon from '../../../../../assets/images/payment.svg';

interface OrderDetailsRouteParams {
	order: Order;
}

interface OrderItem {
	id: string;
	product: Product;
	quantity: number;
	priceAtPurchase: number;
}

export const OrderDetailsScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const route = useRoute<{
		key: string;
		name: string;
		params: OrderDetailsRouteParams;
	}>();
	const { order } = route.params;
	const [orderItems, setOrderItems] = React.useState<OrderItem[]>([]);
	const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		const loadOrderDetails = async () => {
			try {
				const orderDetails = await orderService.getOrderDetails(
					order.id,
				);

				const items: OrderItem[] = orderDetails.map((detail) => {
					const product = detail.product || {
						id: detail.productId,
						name: `Product ${detail.productId}`,
						price: detail.priceAtPurchase / detail.quantity,
						category: '',
						description: '',
						inStock: 0,
						createdAt: '',
						updatedAt: '',
					};

					return {
						id: detail.id,
						product,
						quantity: detail.quantity,
						priceAtPurchase: detail.priceAtPurchase,
					};
				});

				setOrderItems(items);
			} catch (error) {
			} finally {
				setIsLoading(false);
			}
		};

		loadOrderDetails();
	}, [order.id]);

	const handleBack = () => {
		navigation.goBack();
	};

	const handlePay = async () => {
		setIsProcessingPayment(true);

		try {
			const updatedOrder = await orderService.updateOrderStatus(
				order.id,
				'COMPLETE',
			);

			if (updatedOrder) {
				navigation.navigate(NAVIGATION_KEYS.PAYMENT_SUCCESS);
			}
		} catch (error) {
		} finally {
			setIsProcessingPayment(false);
		}
	};

	const getTotalPrice = () => {
		return orderItems.reduce(
			(total, item) => total + item.priceAtPurchase,
			0,
		);
	};

	if (isLoading) {
		return (
			<View style={styles.screen}>
				<View style={styles.headerContainer}>
					<TouchableOpacity
						onPress={handleBack}
						style={styles.backButton}
					>
						<LeftArrowIcon width={24} height={24} />
					</TouchableOpacity>
					<Text style={styles.title}>Order Details</Text>
				</View>
				<View style={styles.loadingContainer}>
					<Text style={styles.loadingText}>
						Loading order details...
					</Text>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.screen}>
			<View style={styles.headerContainer}>
				<TouchableOpacity
					onPress={handleBack}
					style={styles.backButton}
				>
					<LeftArrowIcon width={24} height={24} />
				</TouchableOpacity>
				<Text style={styles.title}>Order Details</Text>
			</View>

			{orderItems.length > 0 && (
				<View style={styles.totalAmountContainer}>
					<Text style={styles.totalAmountText}>
						Total amount ${getTotalPrice().toFixed(2)}
					</Text>
				</View>
			)}

			<FlatList
				data={orderItems}
				renderItem={({ item }) => (
					<View style={styles.cartItemContainer}>
						<View style={styles.cartItemContent}>
							<View style={styles.textInfoContainer}>
								<Text style={styles.productName}>
									{item.product.name}
								</Text>
								<View style={styles.totalAndAmountRow}>
									<Text style={styles.totalLabel}>Total</Text>
									<Text style={styles.totalValue}>
										${item.priceAtPurchase}
									</Text>
									<Text style={styles.amountLabel}>
										Amount
									</Text>
									<Text style={styles.amountValue}>
										{item.quantity}
									</Text>
								</View>
							</View>
						</View>
					</View>
				)}
				keyExtractor={(item) => item.id}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={() => (
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>
							No items in this order
						</Text>
					</View>
				)}
				contentContainerStyle={styles.listContent}
			/>

			{orderItems.length > 0 && (
				<View style={styles.payContainer}>
					<TouchableOpacity
						style={[
							styles.payButton,
							isProcessingPayment && styles.payButtonDisabled,
						]}
						onPress={handlePay}
						disabled={isProcessingPayment}
					>
						<View style={styles.payButtonContent}>
							<PaymentIcon width={16} height={16} />
							<Text style={styles.payText}>
								{isProcessingPayment ? 'Processing...' : 'Pay'}
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: 16,
		marginTop: 20,
		position: 'relative',
	},
	backButton: {
		position: 'absolute',
		left: 16,
		top: 0,
		padding: 8,
		zIndex: 10,
	},
	title: {
		textAlign: 'center',
		color: COLORS.text,
		fontFamily: FONTS.PoppinsBold,
		fontSize: 24,
		lineHeight: 36,
		letterSpacing: 0,
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 50,
	},
	loadingText: {
		fontSize: 16,
		color: COLORS.text,
		fontFamily: FONTS.PoppinsRegular,
	},
	totalAmountContainer: {
		alignItems: 'center',
		paddingHorizontal: 16,
		marginTop: 19,
	},
	totalAmountText: {
		fontSize: 16,
		fontFamily: FONTS.InterBold,
		fontWeight: '700',
		lineHeight: 25.6,
		color: COLORS.text,
		textAlign: 'center',
	},
	listContent: {
		paddingHorizontal: 16,
		paddingTop: 40,
		paddingBottom: 100,
	},
	cartItemContainer: {
		width: 361,
		height: 72,
		backgroundColor: COLORS.background,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#777777',
		marginBottom: 15,
		alignSelf: 'center',
	},
	cartItemContent: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	textInfoContainer: {
		flex: 1,
		height: 52,
		justifyContent: 'center',
	},
	productName: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsRegular,
		fontWeight: '400',
		lineHeight: 20,
		color: COLORS.text,
		marginBottom: 6,
		flexWrap: 'wrap',
	},
	totalAndAmountRow: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 26,
		justifyContent: 'flex-start',
	},
	totalLabel: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsBold,
		fontWeight: '700',
		lineHeight: 20,
		color: COLORS.text,
		marginRight: 4,
		textAlignVertical: 'center',
		marginBottom: 2,
	},
	totalValue: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsRegular,
		fontWeight: '400',
		lineHeight: 20,
		color: COLORS.text,
		marginRight: 15,
		textAlignVertical: 'center',
		marginTop: 2,
	},
	amountLabel: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsBold,
		fontWeight: '700',
		lineHeight: 20,
		color: COLORS.text,
		marginRight: 4,
		textAlignVertical: 'center',
		marginBottom: 2,
	},
	amountValue: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsRegular,
		fontWeight: '400',
		lineHeight: 20,
		color: COLORS.text,
		textAlignVertical: 'center',
		marginTop: 2,
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
	payContainer: {
		position: 'absolute',
		bottom: 33,
		left: 16,
		right: 16,
	},
	payButton: {
		width: '100%',
		height: 50,
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	payButtonContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	payText: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsBold,
		fontWeight: '700',
		color: COLORS.white,
	},
	payButtonDisabled: {
		opacity: 0.6,
	},
});
