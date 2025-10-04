import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useDebounceEffect } from 'src/shared/hooks/use-debounce-effect.hook';
import { ProductSortIcons } from '../product-sort-icons';
import { SortBy, SortOrder } from 'src/shared/types';
import { styles } from './product-search.styles';

interface SortOption {
	sortBy: SortBy;
	order: SortOrder;
}

interface ProductSearchProps {
	onSearchChange: (searchTerm: string) => void;
	sortOptions: SortOption[];
	onSortChange: (sortOptions: SortOption[]) => void;
	onClearFilters: () => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
	onSearchChange,
	sortOptions,
	onSortChange,
	onClearFilters,
}) => {
	const [searchTerm, setSearchTerm] = useState('');

	useDebounceEffect(
		() => {
			onSearchChange(searchTerm);
		},
		500,
		[searchTerm],
	);

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.searchInput}
				placeholder="Enter product name"
				value={searchTerm}
				onChangeText={setSearchTerm}
			/>
			<ProductSortIcons
				sortOptions={sortOptions}
				onSortChange={onSortChange}
				onClearFilters={onClearFilters}
			/>
		</View>
	);
};
