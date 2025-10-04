import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../../styles/fonts';
import { COLORS } from '../../styles/colors';
import { useCartStore } from '../../stores/cart.store';
import CartIcon from '../../../../assets/images/cart.svg';
import CartQuantityIcon from '../../../../assets/images/cart-quantity.svg';

interface CartIconWithQuantityProps {
	size?: number;
}

export const CartIconWithQuantity: React.FC<CartIconWithQuantityProps> = ({
	size = 24,
}) => {
	const { getTotalItems } = useCartStore();
	const totalItems = getTotalItems();

	return (
		<View style={styles.container}>
			<CartIcon width={size} height={size} />
			{totalItems > 0 && (
				<View style={styles.quantityContainer}>
					<CartQuantityIcon width={19} height={20} />
					<Text style={styles.quantityText}>{totalItems}</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		width: 24,
		height: 24,
	},
	quantityContainer: {
		position: 'absolute',
		top: 11,
		left: 12,
		width: 19,
		height: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	quantityText: {
		position: 'absolute',
		fontSize: 12,
		fontFamily: FONTS.PoppinsBold,
		fontWeight: '700',
		color: COLORS.white,
		textAlign: 'center',
		lineHeight: 14,
	},
});
