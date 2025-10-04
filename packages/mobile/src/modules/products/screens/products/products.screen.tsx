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
import { FONTS } from '../../../../shared/styles/fonts';
import { COLORS } from '../../../../shared/styles/colors';
import { ProductSearch } from '../../components/product-search';
import { ProductCard } from '../../components/product-card';
import { Product, SortBy, SortOrder } from 'src/shared/types';
import { productService } from 'src/shared/services/product.service';
import { NAVIGATION_KEYS } from '../../../navigation/types/navigation.type';
import { CartIconWithQuantity } from '../../../../shared/components/cart-icon-with-quantity/cart-icon-with-quantity.component';

interface SortOption {
	sortBy: SortBy;
	order: SortOrder;
}

export const ProductsScreen = () => {
	const navigation = useNavigation();
	const [sortOptions, setSortOptions] = React.useState<SortOption[]>([]);
	const [products, setProducts] = React.useState<Product[]>([]);
	const [totalPages, setTotalPages] = React.useState(0);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [refreshing, setRefreshing] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [searchTerm, setSearchTerm] = React.useState('');
	const [hasLoadedMore, setHasLoadedMore] = React.useState(false);
	const [allProducts, setAllProducts] = React.useState<Product[]>([]);
	const [sortedProducts, setSortedProducts] = React.useState<Product[]>([]);

	const handleProductPress = (product: Product) => {
		(
			navigation as {
				navigate: (
					screen: string,
					params: { product: Product },
				) => void;
			}
		).navigate('PRODUCT_INFORMATION', { product });
	};

	const handleCartPress = () => {
		(navigation as any).navigate(NAVIGATION_KEYS.CART);
	};

	const loadAllProducts = async () => {
		try {
			let allProducts: Product[] = [];
			let page = 1;
			let hasMore = true;

			while (hasMore) {
				const response = await productService.getProducts({
					name: '',
					page,
					limit: 50,
				});

				allProducts = [...allProducts, ...response.products];
				hasMore = response.products.length === 50;
				page++;
			}

			if (searchTerm.trim()) {
				allProducts = allProducts.filter((product) =>
					product.name
						.toLowerCase()
						.includes(searchTerm.toLowerCase()),
				);
			}

			setAllProducts(allProducts);
			return allProducts;
		} catch (error) {
			return [];
		}
	};

	const applySorting = (products: Product[]) => {
		if (sortOptions.length === 0) {
			return products;
		}

		return [...products].sort((a, b) => {
			for (const sortOption of sortOptions) {
				let comparison = 0;

				switch (sortOption.sortBy) {
					case SortBy.PRICE:
						comparison = a.price - b.price;
						break;
					case SortBy.NAME:
						comparison = a.name.localeCompare(b.name);
						break;
					case SortBy.CREATED_AT:
						comparison =
							new Date(a.createdAt).getTime() -
							new Date(b.createdAt).getTime();
						break;
				}

				if (sortOption.order === SortOrder.DESC) {
					comparison = -comparison;
				}

				if (comparison !== 0) {
					return comparison;
				}
			}
			return 0;
		});
	};

	const handleLoadMore = () => {
		if (currentPage < totalPages && !loading && !hasLoadedMore) {
			setHasLoadedMore(true);
			setCurrentPage((prev) => prev + 1);
		}
	};

	const handleRefresh = async () => {
		setRefreshing(true);
		setCurrentPage(1);
		const products = await loadAllProducts();
		const sorted = applySorting(products);
		setSortedProducts(sorted);
		setRefreshing(false);
	};

	const loadProducts = async (page: number, reset = false) => {
		setLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 800));

			const itemsPerPage = 6;
			const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
			const startIndex = (page - 1) * itemsPerPage;
			const endIndex = startIndex + itemsPerPage;
			const pageProducts = sortedProducts.slice(startIndex, endIndex);

			if (reset || page === 1) {
				setProducts(pageProducts);
			} else {
				setProducts((prev) => {
					const newProducts = [...prev, ...pageProducts];
					return newProducts;
				});
			}
			setTotalPages(totalPages);
		} catch (error) {
		} finally {
			setLoading(false);
			setHasLoadedMore(false);
		}
	};

	React.useEffect(() => {
		const loadAndSort = async () => {
			const products = await loadAllProducts();
			const sorted = applySorting(products);
			setSortedProducts(sorted);
			setCurrentPage(1);
		};
		loadAndSort();
	}, [searchTerm]);

	React.useEffect(() => {
		if (allProducts.length > 0) {
			const sorted = applySorting(allProducts);
			setSortedProducts(sorted);
			setCurrentPage(1);
		}
	}, [sortOptions]);

	React.useEffect(() => {
		loadProducts(currentPage, currentPage === 1);
	}, [sortedProducts, currentPage]);

	return (
		<View style={styles.screen}>
			<View style={styles.headerContainer}>
				<Text style={styles.title}>Products</Text>
			</View>
			<TouchableOpacity
				onPress={handleCartPress}
				style={styles.cartButton}
			>
				<CartIconWithQuantity size={24} />
			</TouchableOpacity>
			<View style={styles.searchContainer}>
				<ProductSearch
					onSearchChange={setSearchTerm}
					sortOptions={sortOptions}
					onSortChange={setSortOptions}
					onClearFilters={() => {
						setSortOptions([]);
						setSearchTerm('');
					}}
				/>
			</View>
			<FlatList
				data={products}
				renderItem={({ item }) => (
					<View style={styles.cardContainer}>
						<ProductCard
							product={item}
							onPress={() => handleProductPress(item)}
						/>
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
						<Text style={styles.emptyText}>No products found</Text>
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
	cartButton: {
		position: 'absolute',
		right: 16,
		top: 14,
		padding: 8,
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
});
