import ConfirmModal from "@/features/admin/presentation/components/ConfirmModal";
import { useDeleteProduct } from "@/features/admin/presentation/hooks/useAdmin";
import type { AdminProduct } from "@/features/admin/domain/entities/admin.entity";

interface Props {
  open: boolean;
  product: AdminProduct | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DeleteProductModal({
  open,
  product,
  onClose,
  onSuccess,
}: Props) {
  const { mutate, isPending } = useDeleteProduct();

  const handleConfirm = () => {
    if (!product) return;
    mutate(product.productId, {
      onSuccess: () => {
        onClose();
        onSuccess?.();
      },
    });
  };

  return (
    <ConfirmModal
      open={open}
      variant="danger"
      title="Xóa sản phẩm"
      description={`Bạn có chắc muốn xóa sản phẩm "${product?.name}"? Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn sản phẩm khỏi hệ thống.`}
      confirmLabel="Xóa vĩnh viễn"
      loading={isPending}
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  );
}
