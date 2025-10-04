import { create } from 'zustand';
import { CartItem, Product } from '../types/order.types';

interface CartStore {
	cartItems: CartItem[];
	addToCart: (product: Product, quantity?: number) => void;
	removeFromCart: (productId: string) => void;
	updateQuantity: (productId: string, quantity: number) => void;
	clearCart: () => void;
	getTotalItems: () => number;
	getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
	cartItems: [],

	addToCart: (product: Product, quantity = 1) => {
		const { cartItems } = get();
		const existingItem = cartItems.find(
			(item) => item.product.id === product.id,
		);

		const currentQuantity = existingItem ? existingItem.quantity : 0;
		const newTotalQuantity = currentQuantity + quantity;

		if (newTotalQuantity > product.inStock) {
			return;
		}

		if (existingItem) {
			set({
				cartItems: cartItems.map((item) =>
					item.product.id === product.id
						? {
								...item,
								quantity: newTotalQuantity,
								priceAtPurchase:
									newTotalQuantity * product.price,
							}
						: item,
				),
			});
		} else {
			const newItem: CartItem = {
				id: `${product.id}-${Date.now()}`,
				product,
				quantity,
				priceAtPurchase: quantity * product.price,
			};
			set({ cartItems: [...cartItems, newItem] });
		}
	},

	removeFromCart: (productId: string) => {
		const { cartItems } = get();
		set({
			cartItems: cartItems.filter(
				(item) => item.product.id !== productId,
			),
		});
	},

	updateQuantity: (productId: string, quantity: number) => {
		const { cartItems } = get();
		if (quantity <= 0) {
			get().removeFromCart(productId);
			return;
		}

		const item = cartItems.find((item) => item.product.id === productId);
		if (item && quantity > item.product.inStock) {
			quantity = item.product.inStock;
		}

		set({
			cartItems: cartItems.map((item) => {
				if (item.product.id === productId) {
					return {
						...item,
						quantity,
						priceAtPurchase: quantity * item.product.price,
					};
				}
				return item;
			}),
		});
	},

	clearCart: () => {
		set({ cartItems: [] });
	},

	getTotalItems: () => {
		const { cartItems } = get();
		return cartItems.reduce((total, item) => total + item.quantity, 0);
	},

	getTotalPrice: () => {
		const { cartItems } = get();
		return cartItems.reduce(
			(total, item) => total + item.priceAtPurchase,
			0,
		);
	},
}));
