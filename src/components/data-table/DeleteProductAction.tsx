'use client';

import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useDeleteProduct } from '@/utils/productApi';
import { useCanDeleteProduct } from '@/utils/roleHelpers';
import { enqueueSnackbar } from 'notistack';

interface DeleteProductActionProps {
	productId: string;
	onDeleteSuccess?: () => void;
}

/**
 * Delete action button for product rows in MaterialReactTable
 * Only visible for users with supplier or superadmin roles
 */
export function DeleteProductAction({ productId, onDeleteSuccess }: DeleteProductActionProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const canDelete = useCanDeleteProduct();
	const deleteProduct = useDeleteProduct();

	// Don't render if user doesn't have permission
	if (!canDelete) {
		return null;
	}

	const handleDelete = async () => {
		if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
			return;
		}

		setIsDeleting(true);
		try {
			await deleteProduct(productId);
			enqueueSnackbar('تم حذف العنصر بنجاح', { variant: 'success' });
			onDeleteSuccess?.();
		} catch (error) {
			console.error('Delete error:', error);
			enqueueSnackbar('فشل حذف العنصر', { variant: 'error' });
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Tooltip title="حذف">
			<IconButton
				size="small"
				onClick={handleDelete}
				disabled={isDeleting}
				color="error"
				aria-label="حذف العنصر"
			>
				<FuseSvgIcon>lucide:trash-2</FuseSvgIcon>
			</IconButton>
		</Tooltip>
	);
}

export default DeleteProductAction;


