import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SortBy, SortOrder } from 'src/shared/types';
import { styles } from './product-sort-icons.styles';

import CalendarDaysIcon from '../../../../../assets/images/calendar-days.svg';
import CurrencyDollarIcon from '../../../../../assets/images/currency-dollar.svg';
import SortAZIcon from '../../../../../assets/images/az.svg';
import ArrowLongDownIcon from '../../../../../assets/images/arrow-long-down.svg';
import ArrowLongUpIcon from '../../../../../assets/images/arrow-long-up.svg';
import BackspaceIcon from '../../../../../assets/images/backspace.svg';

interface SortOption {
	sortBy: SortBy;
	order: SortOrder;
}

interface ProductSortIconsProps {
	sortOptions: SortOption[];
	onSortChange: (sortOptions: SortOption[]) => void;
	onClearFilters: () => void;
}

export const ProductSortIcons: React.FC<ProductSortIconsProps> = ({
	sortOptions,
	onSortChange,
	onClearFilters,
}) => {
	const getSortText = () => {
		if (sortOptions.length === 0) return 'Sort: by default';

		const texts = sortOptions.map((option) => {
			switch (option.sortBy) {
				case SortBy.PRICE:
					return option.order === SortOrder.DESC
						? 'to cheapest'
						: 'to expensive';
				case SortBy.NAME:
					return option.order === SortOrder.DESC
						? 'Z to A'
						: 'A to Z';
				case SortBy.CREATED_AT:
					return option.order === SortOrder.DESC
						? 'newest first'
						: 'oldest first';
				default:
					return '';
			}
		});

		return `Sort: ${texts.join(', ')}`;
	};

	const getSortIcon = (iconSortBy: SortBy) => {
		const existingOption = sortOptions.find(
			(option) => option.sortBy === iconSortBy,
		);

		if (!existingOption) {
			switch (iconSortBy) {
				case SortBy.PRICE:
					return <CurrencyDollarIcon width={24} height={24} />;
				case SortBy.NAME:
					return <SortAZIcon width={24} height={24} />;
				case SortBy.CREATED_AT:
					return <CalendarDaysIcon width={24} height={24} />;
			}
		}

		if (existingOption.order === SortOrder.DESC) {
			return <ArrowLongDownIcon width={24} height={24} />;
		} else {
			return <ArrowLongUpIcon width={24} height={24} />;
		}
	};

	const handleSortPress = (iconSortBy: SortBy) => {
		const existingOption = sortOptions.find(
			(option) => option.sortBy === iconSortBy,
		);
		let newSortOptions = [...sortOptions];

		if (existingOption) {
			if (existingOption.order === SortOrder.DESC) {
				newSortOptions = newSortOptions.map((option) =>
					option.sortBy === iconSortBy
						? { ...option, order: SortOrder.ASC }
						: option,
				);
			} else if (existingOption.order === SortOrder.ASC) {
				newSortOptions = newSortOptions.filter(
					(option) => option.sortBy !== iconSortBy,
				);
			}
		} else {
			newSortOptions = [
				...newSortOptions,
				{ sortBy: iconSortBy, order: SortOrder.DESC },
			];
		}

		onSortChange(newSortOptions);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.sortText}>{getSortText()}</Text>
			<View style={styles.iconsContainer}>
				<TouchableOpacity
					style={[
						styles.iconButton,
						sortOptions.some(
							(option) => option.sortBy === SortBy.PRICE,
						) && styles.activeIconButton,
					]}
					onPress={() => handleSortPress(SortBy.PRICE)}
				>
					{getSortIcon(SortBy.PRICE)}
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.iconButton,
						sortOptions.some(
							(option) => option.sortBy === SortBy.NAME,
						) && styles.activeIconButton,
					]}
					onPress={() => handleSortPress(SortBy.NAME)}
				>
					{getSortIcon(SortBy.NAME)}
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.iconButton,
						sortOptions.some(
							(option) => option.sortBy === SortBy.CREATED_AT,
						) && styles.activeIconButton,
					]}
					onPress={() => handleSortPress(SortBy.CREATED_AT)}
				>
					{getSortIcon(SortBy.CREATED_AT)}
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.clearButton}
					onPress={onClearFilters}
				>
					<BackspaceIcon width={20} height={20} />
				</TouchableOpacity>
			</View>
		</View>
	);
};
