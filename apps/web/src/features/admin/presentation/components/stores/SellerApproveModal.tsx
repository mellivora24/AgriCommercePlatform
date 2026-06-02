import ConfirmModal from "@/features/admin/presentation/components/ConfirmModal";
import { useApproveSeller } from "@/features/admin/presentation/hooks/useAdmin";
import type { Store } from "@/features/admin/domain/entities/admin.entity";

interface Props {
  open: boolean;
  store: Store | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SellerApproveModal({
  open,
  store,
  onClose,
  onSuccess,
}: Props) {
  const { mutate, isPending } = useApproveSeller();

  const handleConfirm = () => {
    if (!store) return;
    mutate(store.sellerId, {
      onSuccess: () => {
        onClose();
        onSuccess?.();
      },
    });
  };

  return (
    <ConfirmModal
      open={open}
      variant="primary"
      title="Duyệt cửa hàng"
      description={
        store
          ? `Bạn có chắc muốn duyệt cửa hàng "${store.storeName}"? Sau khi duyệt, cửa hàng sẽ có thể bán hàng trên sàn.`
          : ""
      }
      confirmLabel="Duyệt cửa hàng"
      loading={isPending}
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  );
}
