import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useBuyerOrders } from "@/presentation/hooks/useCommerce";
import type { Order } from "@/domain/entities/order.entity";
import { OrderStatus } from "@/core/types/enum";
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
  WAITING_SELLER_CONFIRMATION: "Chờ xác nhận",
  SELLER_CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  REFUNDED: "Đã hoàn tiền",
  RETURN_REQUESTED: "Yêu cầu hoàn trả",
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  COD: "COD",
  ONLINE: "Chuyển khoản",
};

const TABS: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "Tất cả", value: "ALL" },
  {
    label: "Chờ xác nhận",
    value: OrderStatus.WAITING_SELLER_CONFIRMATION,
  },
  {
    label: "Đang giao",
    value: OrderStatus.SHIPPING,
  },
  {
    label: "Hoàn thành",
    value: OrderStatus.COMPLETED,
  },
  {
    label: "Đã hủy",
    value: OrderStatus.CANCELLED,
  },
];

const OrderCard: React.FC<{ order: Order; onPress: () => void }> = ({
  order,
  onPress,
}) => {
  const payment = order.payments[0];
  const color = STATUS_COLOR[order.status];

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.75}>
      <View style={s.cardTop}>
        <View style={s.orderIdRow}>
          <Text style={s.orderIdLabel}>Đơn hàng</Text>
          <Text style={s.orderId}>#{order.orderId}</Text>
        </View>

        <View
          style={[
            s.badge,
            { backgroundColor: color + "18", borderColor: color + "40" },
          ]}
        >
          <View style={[s.badgeDot, { backgroundColor: color }]} />

          <Text style={[s.badgeText, { color }]}>
            {STATUS_LABEL[order.status]}
          </Text>
        </View>
      </View>

      <View style={s.divider} />

      <View style={s.itemsRow}>
        <Text style={s.itemsName} numberOfLines={1}>
          {order.orderItems.map((i) => i.product.name).join(", ")}
        </Text>

        <Text style={s.itemsCount}>{order.orderItems.length} sp</Text>
      </View>

      <View style={s.cardBottom}>
        <View>
          <Text style={s.dateText}>{formatDate(order.createdAt)}</Text>

          {payment && (
            <Text style={s.methodText}>
              {PAYMENT_METHOD_LABEL[payment.method] ?? payment.method}
            </Text>
          )}
        </View>

        <View style={s.totalBlock}>
          <Text style={s.totalLabel}>Tổng tiền</Text>

          <Text style={s.totalAmount}>
            {formatCurrency(order.totalAmount)}
          </Text>
        </View>
      </View>

      <View style={s.cardLink}>
        <Text style={s.cardLinkText}>Xem chi tiết →</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function OrderScreen() {
  const router = useRouter();
  const { data: orders, isLoading } = useBuyerOrders();

  const [activeTab, setActiveTab] = useState<OrderStatus | "ALL">("ALL");

  const filtered = orders
    ? activeTab === "ALL"
      ? orders
      : orders.filter((o) => o.status === activeTab)
    : [];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF8" />

      <View style={s.header}>
        <Text style={s.headerTitle}>Đơn hàng của tôi</Text>

        <Text style={s.headerSub}>
          {orders?.length ?? 0} đơn hàng
        </Text>
      </View>

      <View>
        <FlatList
          data={TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(t) => t.value}
          contentContainerStyle={s.tabs}
          renderItem={({ item }) => {
            const active = activeTab === item.value;

            return (
              <TouchableOpacity
                style={[s.tab, active && s.tabActive]}
                onPress={() => setActiveTab(item.value)}
                activeOpacity={0.7}
              >
                <Text style={[s.tabText, active && s.tabTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#111" />

          <Text style={s.centerText}>Đang tải đơn hàng...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={s.center}>
          <Text style={s.emptyIcon}>📦</Text>

          <Text style={s.emptyTitle}>Không có đơn hàng</Text>

          <Text style={s.centerText}>
            Hãy mua sắm ngay hôm nay!
          </Text>

          <TouchableOpacity
            style={s.shopBtn}
            onPress={() => router.push("/products")}
            activeOpacity={0.8}
          >
            <Text style={s.shopBtnText}>Mua sắm ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={filtered}
          keyExtractor={(item) => String(item.orderId)}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => router.push(`/orders/${item.orderId}`)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FAFAF8",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
    letterSpacing: -0.5,
  },

  headerSub: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 2,
  },

  tabs: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    paddingBottom: 24,
    gap: 8,
  },

  tab: {
    height: 32,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "transparent",
  },

  tabActive: {
    backgroundColor: "#111",
  },

  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },

  tabTextActive: {
    color: "#fff",
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0EFE9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderIdRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  orderIdLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },

  orderId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },

  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 12,
  },

  itemsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  itemsName: {
    fontSize: 13,
    color: "#374151",
    flex: 1,
    marginRight: 8,
  },

  itemsCount: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  methodText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
    fontWeight: "500",
  },

  totalBlock: {
    alignItems: "flex-end",
  },

  totalLabel: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  totalAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EF4444",
  },

  cardLink: {
    marginTop: 12,
    alignItems: "flex-end",
  },

  cardLinkText: {
    fontSize: 12,
    color: "#6366F1",
    fontWeight: "600",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  centerText: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 4,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  shopBtn: {
    marginTop: 12,
    backgroundColor: "#111",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },

  shopBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
