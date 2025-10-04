import * as React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { FONTS } from '../../../../shared/styles/fonts';
import { COLORS } from '../../../../shared/styles/colors';
import { Product } from '../../../../shared/types';
import {
	NAVIGATION_KEYS,
	RootStackParamList,
} from '../../../navigation/types/navigation.type';
import { useCartStore } from '../../../../shared/stores/cart.store';
import { useAuthStore } from '../../../../shared/stores/auth.store';
import { orderService } from '../../../../shared/services/order.service';
import CartIcon from '../../../../../assets/images/cart.svg';
import LeftArrowIcon from '../../../../../assets/images/left-arrow.svg';
import DeleteItemIcon from '../../../../../assets/images/delete-item.svg';

export const CartScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const { cartItems, getTotalPrice, removeFromCart, clearCart } =
		useCartStore();
	const { user } = useAuthStore();
	const [isCreatingOrder, setIsCreatingOrder] = React.useState(false);

	React.useEffect(() => {}, [cartItems]);

	const handleBack = () => {
		navigation.navigate(NAVIGATION_KEYS.MAIN_TABS, {
			screen: 'Products',
		});
	};

	const handleCartPress = () => {};

	const handleProductPress = (product: Product) => {
		navigation.navigate(NAVIGATION_KEYS.EDIT_CART_ITEM, { product });
	};

	const handleDeleteItem = (productId: string) => {
		removeFromCart(productId);
	};

	const handleCreateOrder = async () => {
		if (cartItems.length === 0) {
			return;
		}

		if (!user?.id) {
			return;
		}

		setIsCreatingOrder(true);

		try {
			const order = await orderService.createOrder(user.id, cartItems);

			if (order) {
				navigation.navigate(NAVIGATION_KEYS.MAIN_TABS, {
					screen: 'Orders',
				});

				clearCart();
			}
		} catch (error) {
		} finally {
			setIsCreatingOrder(false);
		}
	};

	return (
		<View style={styles.screen}>
			<View style={styles.headerContainer}>
				<TouchableOpacity
					onPress={handleBack}
					style={styles.backButton}
				>
					<LeftArrowIcon width={24} height={24} />
				</TouchableOpacity>
				<Text style={styles.title}>Cart</Text>
				<TouchableOpacity
					onPress={handleCartPress}
					style={styles.cartButton}
				>
					<CartIcon width={24} height={24} />
				</TouchableOpacity>
			</View>

			{cartItems.length > 0 && (
				<View style={styles.totalAmountContainer}>
					<Text style={styles.totalAmountText}>
						Total amount ${getTotalPrice().toFixed(2)}
					</Text>
				</View>
			)}

			<FlatList
				data={cartItems}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.cartItemContainer}
						onPress={() => handleProductPress(item.product)}
					>
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
							<TouchableOpacity
								style={styles.deleteButton}
								onPress={() =>
									handleDeleteItem(item.product.id)
								}
							>
								<DeleteItemIcon width={20} height={20} />
							</TouchableOpacity>
						</View>
					</TouchableOpacity>
				)}
				keyExtractor={(item) => item.id}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={() => (
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>Your cart is empty</Text>
					</View>
				)}
				contentContainerStyle={styles.listContent}
			/>

			{cartItems.length > 0 && (
				<View style={styles.createOrderContainer}>
					<TouchableOpacity
						style={[
							styles.createOrderButton,
							isCreatingOrder && styles.createOrderButtonDisabled,
						]}
						onPress={handleCreateOrder}
						disabled={isCreatingOrder}
					>
						<Text style={styles.createOrderText}>
							{isCreatingOrder ? 'Creating...' : 'Create Order'}
						</Text>
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
	cartButton: {
		position: 'absolute',
		right: 16,
		top: 0,
		padding: 8,
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
		backgroundColor: COLORS.white,
		borderRadius: 12,
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
	deleteButton: {
		padding: 4,
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
	createOrderContainer: {
		position: 'absolute',
		bottom: 33,
		left: 16,
		right: 16,
	},
	createOrderButton: {
		width: '100%',
		height: 50,
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	createOrderText: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsBold,
		fontWeight: '700',
		color: COLORS.white,
	},
	createOrderButtonDisabled: {
		opacity: 0.6,
	},
});
