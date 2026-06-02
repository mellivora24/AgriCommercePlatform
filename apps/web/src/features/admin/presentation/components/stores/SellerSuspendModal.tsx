import ConfirmModal from "@/features/admin/presentation/components/ConfirmModal";
import { useSuspendSeller } from "@/features/admin/presentation/hooks/useAdmin";
import type { Store } from "@/features/admin/domain/entities/admin.entity";

interface Props {
  open: boolean;
  store: Store | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SellerSuspendModal({
  open,
  store,
  onClose,
  onSuccess,
}: Props) {
  const { mutate, isPending } = useSuspendSeller();

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
      variant="warning"
      title="Đình chỉ cửa hàng"
      description={`Bạn có chắc muốn đình chỉ cửa hàng "${store?.storeName}"? Cửa hàng sẽ không thể bán hàng cho đến khi được khôi phục.`}
      confirmLabel="Đình chỉ"
      loading={isPending}
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  );
}
