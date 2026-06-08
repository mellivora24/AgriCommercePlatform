import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  useOrderDetail,
  useCancelOrder,
} from "@/presentation/hooks/useCommerce";
import type {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@/core/types/enum";
import { formatCurrency, formatDate } from "@/core/utils/format";

const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "#F59E0B",
  PAID: "#3B82F6",
  WAITING_SELLER_CONFIRMATION: "#F59E0B",
  SELLER_CONFIRMED: "#3B82F6",
  SHIPPING: "#8B5CF6",
  DELIVERED: "#10B981",
  COMPLETED: "#10B981",
  CANCELLED: "#EF4444",
  REFUNDED: "#6B7280",
  RETURN_REQUESTED: "#F59E0B",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  WAITING_SELLER_CONFIRMATION: "Chờ xác nhận từ người bán",
  SELLER_CONFIRMED: "Người bán đã xác nhận",
  SHIPPING: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  REFUNDED: "Đã hoàn tiền",
  RETURN_REQUESTED: "Yêu cầu hoàn trả",
};

const PAYMENT_STATUS_COLOR: Record<PaymentStatus, string> = {
  PENDING: "#F59E0B",
  WAITING_COD_COLLECTION: "#F59E0B",
  WAITING_ONLINE_PAYMENT: "#F59E0B",
  COMPLETED: "#10B981",
  FAILED: "#EF4444",
  REFUNDED: "#6B7280",
};

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  COD: "Thanh toán khi nhận hàng (COD)",
  ONLINE: "Chuyển khoản ngân hàng",
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={s.section}>
    <Text style={s.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Row: React.FC<{ label: string; value: string; valueStyle?: object }> = ({
  label,
  value,
  valueStyle,
}) => (
  <View style={s.row}>
    <Text style={s.rowLabel}>{label}</Text>
    <Text style={[s.rowValue, valueStyle]} numberOfLines={2}>
      {value}
    </Text>
  </View>
);

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : undefined;

  const { data: order, isLoading, error } = useOrderDetail(orderId);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  if (isLoading) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.center}>
          <ActivityIndicator size="large" color="#111" />
          <Text style={s.centerText}>Đang tải đơn hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.center}>
          <Text style={s.errorIcon}>⚠️</Text>
          <Text style={s.errorTitle}>Không tìm thấy đơn hàng</Text>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={s.backBtnText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const payment = order.payments[0];
  const statusColor = STATUS_COLOR[order.status];
  const canCancel =
    order.status === "WAITING_SELLER_CONFIRMATION" ||
    order.status === "PENDING_PAYMENT";
  const canReturn = order.status === "DELIVERED";

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF8" />

      <View style={s.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.backIcon}
          activeOpacity={0.7}
        >
          <Text style={s.backIconText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Đơn hàng #{order.orderId}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.statusBanner, { borderLeftColor: statusColor }]}>
          <View style={[s.statusDot, { backgroundColor: statusColor }]} />
          <View style={{ flex: 1 }}>
            <Text style={[s.statusLabel, { color: statusColor }]}>
              {STATUS_LABEL[order.status]}
            </Text>
            <Text style={s.statusDate}>{formatDate(order.createdAt)}</Text>
          </View>
        </View>

        <Section title="Sản phẩm">
          {order.orderItems.map((item, idx) => {
            const imageUri = item.product.images?.[0]?.url;
            return (
              <View
                key={item.orderItemId}
                style={[
                  s.productRow,
                  idx < order.orderItems.length - 1 && s.productRowBorder,
                ]}
              >
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={s.productImg}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[s.productImg, s.productImgPlaceholder]}>
                    <Text style={{ fontSize: 20 }}>📦</Text>
                  </View>
                )}
                <View style={s.productMeta}>
                  <Text style={s.productName} numberOfLines={2}>
                    {item.product.name}
                  </Text>
                  <Text style={s.productQty}>Số lượng: {item.quantity}</Text>
                </View>
                <View style={s.productPriceBlock}>
                  <Text style={s.productTotal}>
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </Text>
                  <Text style={s.productUnit}>
                    {formatCurrency(item.unitPrice)}/sp
                  </Text>
                </View>
              </View>
            );
          })}
        </Section>

        <Section title="Thông tin nhận hàng">
          <Row label="Người nhận" value={order.receiverName} />
          <Row label="Số điện thoại" value={order.receiverPhone} />
          <Row label="Địa chỉ" value={order.shippingAddress} />
          {order.seller && (
            <Row label="Người bán" value={order.seller.shopName} />
          )}
        </Section>

        {payment && (
          <Section title="Thanh toán">
            <Row
              label="Phương thức"
              value={PAYMENT_METHOD_LABEL[payment.method]}
            />
            <View style={s.row}>
              <Text style={s.rowLabel}>Trạng thái</Text>
              <View
                style={[
                  s.payBadge,
                  {
                    backgroundColor:
                      PAYMENT_STATUS_COLOR[payment.status] + "18",
                  },
                ]}
              >
                <Text
                  style={[
                    s.payBadgeText,
                    { color: PAYMENT_STATUS_COLOR[payment.status] },
                  ]}
                >
                  {payment.status}
                </Text>
              </View>
            </View>
            <Row
              label="Số tiền"
              value={formatCurrency(payment.amount)}
              valueStyle={{ color: "#EF4444", fontWeight: "700" }}
            />
          </Section>
        )}

        <Section title="Tóm tắt">
          <Row label="Tạm tính" value={formatCurrency(order.totalAmount)} />
          <Row
            label="Phí vận chuyển"
            value="Miễn phí"
            valueStyle={{ color: "#10B981" }}
          />
          <View style={s.totalDivider} />
          <View style={s.row}>
            <Text
              style={[
                s.rowLabel,
                { fontWeight: "700", color: "#111", fontSize: 15 },
              ]}
            >
              Tổng cộng
            </Text>
            <Text style={s.grandTotal}>
              {formatCurrency(order.totalAmount)}
            </Text>
          </View>
        </Section>

        {(canCancel || canReturn) && (
          <View style={s.actions}>
            {canCancel && (
              <TouchableOpacity
                style={[
                  s.actionBtn,
                  s.cancelBtn,
                  isCancelling && { opacity: 0.6 },
                ]}
                onPress={() => cancelOrder(order.orderId)}
                disabled={isCancelling}
                activeOpacity={0.8}
              >
                <Text style={s.cancelBtnText}>
                  {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
                </Text>
              </TouchableOpacity>
            )}
            {canReturn && (
              <TouchableOpacity
                style={[s.actionBtn, s.returnBtn]}
                activeOpacity={0.8}
              >
                <Text style={s.returnBtnText}>Yêu cầu hoàn trả</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FAFAF8" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  centerText: { fontSize: 14, color: "#9CA3AF" },
  errorIcon: { fontSize: 48 },
  errorTitle: { fontSize: 16, fontWeight: "600", color: "#374151" },
  backBtn: {
    marginTop: 12,
    backgroundColor: "#111",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backBtnText: { color: "#fff", fontWeight: "600" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EFE9",
  },
  backIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backIconText: { fontSize: 22, color: "#111" },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#111" },

  scroll: { padding: 16, gap: 12 },

  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusLabel: { fontSize: 15, fontWeight: "700" },
  statusDate: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },

  section: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0EFE9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    marginBottom: 14,
    letterSpacing: 0.2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
  },
  rowLabel: { fontSize: 13, color: "#6B7280", flex: 1 },
  rowValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
    maxWidth: "60%",
    textAlign: "right",
  },

  productRow: { flexDirection: "row", gap: 12, paddingVertical: 10 },
  productRowBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  productImg: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
  },
  productImgPlaceholder: { alignItems: "center", justifyContent: "center" },
  productMeta: { flex: 1 },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
    lineHeight: 18,
  },
  productQty: { fontSize: 12, color: "#9CA3AF", marginTop: 4 },
  productPriceBlock: { alignItems: "flex-end" },
  productTotal: { fontSize: 14, fontWeight: "700", color: "#111" },
  productUnit: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },

  payBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  payBadgeText: { fontSize: 12, fontWeight: "600" },

  totalDivider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 8 },
  grandTotal: { fontSize: 18, fontWeight: "800", color: "#EF4444" },

  actions: { gap: 10 },
  actionBtn: { borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  cancelBtn: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  cancelBtnText: { color: "#EF4444", fontWeight: "700", fontSize: 15 },
  returnBtn: { backgroundColor: "#111" },
  returnBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
