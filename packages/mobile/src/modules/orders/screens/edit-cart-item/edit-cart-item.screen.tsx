import * as React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { FONTS } from '../../../../shared/styles/fonts';
import { COLORS } from '../../../../shared/styles/colors';
import { Product } from '../../../../shared/types/order.types';
import { useCartStore } from '../../../../shared/stores/cart.store';
import {
	NAVIGATION_KEYS,
	RootStackParamList,
} from '../../../navigation/types/navigation.type';
import { CartIconWithQuantity } from '../../../../shared/components/cart-icon-with-quantity/cart-icon-with-quantity.component';
import LeftArrowIcon from '../../../../../assets/images/left-arrow.svg';

interface EditCartItemRouteParams {
	product: Product;
}

export const EditCartItemScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const route = useRoute<{
		key: string;
		name: string;
		params: EditCartItemRouteParams;
	}>();
	const { product } = route.params;
	const { cartItems, updateQuantity, removeFromCart } = useCartStore();

	const cartItem = cartItems.find((item) => item.product.id === product.id);
	const currentQuantity = cartItem?.quantity || 0;
	const [quantity, setQuantity] = React.useState(currentQuantity);

	const handleBack = () => {
		navigation.goBack();
	};

	const handleCartPress = () => {
		navigation.navigate(NAVIGATION_KEYS.CART);
	};

	const handleDecrease = () => {
		if (quantity > 0) {
			setQuantity(quantity - 1);
		}
	};

	const handleIncrease = () => {
		if (quantity < product.inStock) {
			setQuantity(quantity + 1);
		}
	};

	const handleSave = () => {
		if (quantity === 0) {
			removeFromCart(product.id);
			navigation.reset({
				index: 0,
				routes: [
					{
						name: NAVIGATION_KEYS.MAIN_TABS,
						params: { screen: 'Products' },
					},
					{ name: NAVIGATION_KEYS.CART },
				],
			});
		} else {
			updateQuantity(product.id, quantity);
			navigation.goBack();
		}
	};

	const handleRemoveFromCart = () => {
		const newQuantity = currentQuantity - quantity;
		if (newQuantity <= 0) {
			removeFromCart(product.id);
			navigation.reset({
				index: 0,
				routes: [
					{
						name: NAVIGATION_KEYS.MAIN_TABS,
						params: { screen: 'Products' },
					},
					{ name: NAVIGATION_KEYS.CART },
				],
			});
		} else {
			updateQuantity(product.id, newQuantity);
			navigation.goBack();
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
				<Text style={styles.title}>Edit Cart Item</Text>
				<TouchableOpacity
					onPress={handleCartPress}
					style={styles.cartButton}
				>
					<CartIconWithQuantity size={24} />
				</TouchableOpacity>
			</View>
			<ScrollView
				style={styles.content}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.productContainer}>
					<View style={styles.infoBlock}>
						<Text style={styles.keyword}>Name:</Text>
						<Text style={styles.info}>{product.name}</Text>
					</View>

					<View style={styles.infoBlock}>
						<Text style={styles.keyword}>Description:</Text>
						<Text style={styles.info}>
							{product.description || 'No description available'}
						</Text>
					</View>

					<View style={styles.infoBlock}>
						<Text style={styles.keyword}>In Stock:</Text>
						<Text style={styles.info}>{product.inStock}</Text>
					</View>

					<View style={styles.infoBlock}>
						<Text style={styles.keyword}>Price:</Text>
						<Text style={styles.info}>${product.price}</Text>
					</View>

					<View style={styles.infoBlock}>
						<Text style={styles.keyword}>Category:</Text>
						<Text style={styles.info}>{product.category}</Text>
					</View>

					<View style={styles.amountBlock}>
						<Text style={styles.keyword}>Amount:</Text>
					</View>

					<View style={styles.quantityContainer}>
						<TouchableOpacity
							style={[
								styles.quantityButton,
								styles.decreaseButton,
								quantity === 0 && styles.disabledButton,
							]}
							onPress={handleDecrease}
							disabled={quantity === 0}
						>
							<Text style={styles.buttonText}>-</Text>
						</TouchableOpacity>

						<View style={styles.quantityDisplay}>
							<Text style={styles.quantityText}>{quantity}</Text>
						</View>

						<TouchableOpacity
							style={[
								styles.quantityButton,
								styles.increaseButton,
								quantity >= product.inStock &&
									styles.disabledButton,
							]}
							onPress={handleIncrease}
							disabled={quantity >= product.inStock}
						>
							<Text style={styles.buttonText}>+</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.removeContainer}>
						<TouchableOpacity onPress={handleRemoveFromCart}>
							<Text style={styles.removeText}>
								Remove from the cart
							</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.addToCartContainer}>
						<TouchableOpacity
							style={styles.addToCartButton}
							onPress={handleSave}
						>
							<Text style={styles.addToCartText}>Save</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
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
		marginTop: 14,
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
	content: {
		flex: 1,
		paddingHorizontal: 16,
	},
	scrollContent: {
		alignItems: 'center',
	},
	productContainer: {
		width: 337,
		height: 424,
		backgroundColor: COLORS.background,
		borderRadius: 12,
		padding: 20,
		marginTop: 20,
	},
	infoBlock: {
		marginBottom: 10,
	},
	amountBlock: {
		marginBottom: 0,
		marginTop: 10,
	},
	keyword: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsSemiBold,
		fontWeight: '600',
		lineHeight: 25.6,
		color: COLORS.text,
		marginBottom: 4,
	},
	info: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsRegular,
		fontWeight: '400',
		lineHeight: 25.6,
		color: COLORS.text,
	},
	quantityContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: 166,
		height: 50,
		marginTop: 20,
		alignSelf: 'center',
	},
	quantityButton: {
		width: 46,
		height: 48,
		borderRadius: 24,
		justifyContent: 'center',
		alignItems: 'center',
	},
	decreaseButton: {
		backgroundColor: COLORS.lightGray,
	},
	increaseButton: {
		backgroundColor: COLORS.primary,
	},
	disabledButton: {
		opacity: 0.5,
	},
	buttonText: {
		fontSize: 24,
		fontFamily: FONTS.PoppinsBold,
		fontWeight: '700',
		color: COLORS.white,
	},
	quantityDisplay: {
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.white,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	quantityText: {
		fontSize: 18,
		fontFamily: FONTS.PoppinsBold,
		fontWeight: '700',
		color: COLORS.text,
	},
	removeContainer: {
		marginTop: 30,
		alignItems: 'center',
	},
	removeText: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsRegular,
		fontWeight: '400',
		color: '#FF6B6B',
		textDecorationLine: 'underline',
	},
	addToCartContainer: {
		marginTop: 148,
		alignItems: 'center',
	},
	addToCartButton: {
		width: 337,
		height: 50,
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	addToCartText: {
		fontSize: 16,
		fontFamily: FONTS.PoppinsBold,
		fontWeight: '700',
		color: COLORS.white,
	},
});
