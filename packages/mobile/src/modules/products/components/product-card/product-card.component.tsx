import { Text, TouchableOpacity, View } from 'react-native';
import { Product } from 'src/shared/types';
import { styles } from './product-card.styles';

interface ProductCardProps {
	product: Product;
	onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
	product,
	onPress,
}) => {
	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.container}>
				<View style={styles.topRow}>
					<Text style={styles.productName}>{product.name}</Text>
					<View style={styles.priceContainer}>
						<Text style={styles.priceLabel}>Price: </Text>
						<Text style={styles.priceValue}>${product.price}</Text>
					</View>
				</View>
				<View style={styles.categoryContainer}>
					<Text style={styles.categoryLabel}>Category: </Text>
					<Text style={styles.categoryValue}>{product.category}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};
