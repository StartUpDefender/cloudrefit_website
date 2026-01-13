'use client';

import { IconButton, Tooltip, Box } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DeleteProductAction from './DeleteProductAction';

interface ProductRowActionsProps {
	productId: string;
	onEdit?: (id: string) => void;
	onDeleteSuccess?: () => void;
}

/**
 * Complete row actions component for product table
 * Includes both edit and delete actions
 * Delete action is only visible for supplier/superadmin roles
 */
export function ProductRowActions({ productId, onEdit, onDeleteSuccess }: ProductRowActionsProps) {
	return (
		<Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
			{/* Edit button */}
			{onEdit && (
				<Tooltip title="تعديل">
					<IconButton
						size="small"
						onClick={() => onEdit(productId)}
						color="primary"
						aria-label="تعديل العنصر"
					>
						<FuseSvgIcon>lucide:pencil</FuseSvgIcon>
					</IconButton>
				</Tooltip>
			)}

			{/* Delete button - Only visible for supplier/superadmin */}
			<DeleteProductAction productId={productId} onDeleteSuccess={onDeleteSuccess} />
		</Box>
	);
}

export default ProductRowActions;


