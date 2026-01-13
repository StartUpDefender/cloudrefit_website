import api from './api';

/**
 * Delete a product by ID
 * The API interceptor will automatically add the authorization token
 * @param productId - The ID of the product to delete
 * @returns Promise with the response
 */
export async function deleteProduct(productId: string): Promise<void> {
	try {
		await api.put(
			`/product/remove/${productId}`,
			'',
			{
				headers: {
					'Content-Type': 'text/plain',
				},
			}
		);
	} catch (error) {
		console.error('Error deleting product:', error);
		throw error;
	}
}

/**
 * Hook to get delete product function
 * @returns Function to delete a product
 */
export function useDeleteProduct() {
	return async (productId: string) => {
		return deleteProduct(productId);
	};
}

