import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SortBy, SortOrder } from 'src/shared/types';
import { styles } from './product-sort.styles';

interface ProductSortProps {
	sortBy: SortBy;
	order: SortOrder;
	onSortChange: (sortBy: SortBy, order: SortOrder) => void;
}

export const ProductSort: React.FC<ProductSortProps> = ({
	sortBy,
	order,
	onSortChange,
}) => {
	const sortOptions = [
		{ key: SortBy.PRICE, label: 'Price' },
		{ key: SortBy.NAME, label: 'Name' },
		{ key: SortBy.CREATED_AT, label: 'Date' },
	];

	const handleSortPress = (newSortBy: SortBy) => {
		if (sortBy === newSortBy) {
			const newOrder =
				order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
			onSortChange(newSortBy, newOrder);
		} else {
			onSortChange(newSortBy, SortOrder.ASC);
		}
	};

	const getSortIcon = (optionSortBy: SortBy) => {
		if (sortBy !== optionSortBy) return '';
		return order === SortOrder.ASC ? '↑' : '↓';
	};

	return (
		<View style={styles.container}>
			{sortOptions.map((option) => (
				<TouchableOpacity
					key={option.key}
					style={[
						styles.sortButton,
						sortBy === option.key && styles.activeButton,
					]}
					onPress={() => handleSortPress(option.key)}
				>
					<Text
						style={[
							styles.buttonText,
							sortBy === option.key && styles.activeButtonText,
						]}
					>
						{option.label} {getSortIcon(option.key)}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};
