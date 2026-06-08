import React, { useMemo } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { AppButton, Card, Screen } from "@/presentation/components";
import { useAuthStore, useCartStore } from "@/core/store";
import { useCartQuery, commerceActions } from "@/presentation/hooks";
import { formatCurrency } from "@/core/utils";
import { ROUTES } from "@/core/router";
import { SafeAreaView } from "react-native-safe-area-context";

export const CartScreen: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isAuthenticated, user } = useAuthStore();
  const isBuyer = isAuthenticated && user?.role === "BUYER";
  const { data: apiCart, isLoading: apiLoading } = useCartQuery();
  const storeItems = useCartStore((state) => state.items);
  const storeUpdateItem = useCartStore((state) => state.updateItem);
  const storeRemoveItem = useCartStore((state) => state.removeItem);
  const items = isBuyer ? (apiCart?.items ?? []) : storeItems;
  const isLoading = isBuyer && apiLoading;

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const invalidateCart = () =>
    queryClient.invalidateQueries({ queryKey: ["cart"] });

  const handleUpdate = async (
    productId: number,
    itemId: number | undefined,
    quantity: number,
  ) => {
    if (quantity <= 0) return;
    if (isBuyer) {
      await commerceActions.updateCartItem(productId, quantity);
      invalidateCart();
    } else {
      storeUpdateItem(productId, quantity);
    }
  };

  const handleRemove = async (
    productId: number,
    itemId: number | undefined,
  ) => {
    if (isBuyer && itemId !== undefined) {
      await commerceActions.removeFromCart(itemId);
      invalidateCart();
    } else {
      storeRemoveItem(productId);
    }
  };

  let HOME_ROUTE = "";
  if (isAuthenticated) {
    if (user?.role === "SELLER") {
      HOME_ROUTE = ROUTES.SELLER_DASHBOARD;
    } else if (user?.role === "ADMIN") {
      HOME_ROUTE = ROUTES.ADMIN_DASHBOARD;
    } else if (user?.role === "SHIPPER") {
      HOME_ROUTE = ROUTES.SHIPPER_DASHBOARD;
    } else {
      HOME_ROUTE = ROUTES.BUYER_HOME;
    }
  }

  if (isLoading) {
    return (
      <Screen>
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Giỏ hàng của bạn</Text>
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#16a34a" />
            <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
          </View>
        </SafeAreaView>
      </Screen>
    );
  }

  return (
    <Screen>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Giỏ hàng của bạn</Text>

        {items.length === 0 ? (
          <Card>
            <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
            <Text style={styles.emptyText}>
              Thêm sản phẩm từ trang chủ hoặc danh sách sản phẩm để bắt đầu đặt
              hàng.
            </Text>
            <AppButton
              title="Tiếp tục mua sắm"
              onPress={() => router.replace(ROUTES.PRODUCTS)}
            />
          </Card>
        ) : (
          <View style={styles.list}>
            {items.map((item) => {
              const itemId = (item as any).itemId as number | undefined;

              return (
                <Card key={itemId ?? item.productId}>
                  <View style={styles.itemRow}>
                    <Image
                      source={{
                        uri:
                          item.image ||
                          "https://placehold.co/128x128/png?text=Item",
                      }}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemBody}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {item.name}
                      </Text>
                      {(item as any).storeName ? (
                        <Text style={styles.itemStore} numberOfLines={1}>
                          🏪 {(item as any).storeName}
                        </Text>
                      ) : null}
                      <Text style={styles.itemPrice}>
                        {formatCurrency(item.price)}
                      </Text>
                      <View style={styles.quantityRow}>
                        <Pressable
                          onPress={() =>
                            handleUpdate(
                              item.productId,
                              itemId,
                              item.quantity - 1,
                            )
                          }
                          style={[
                            styles.quantityButton,
                            item.quantity <= 1 && styles.quantityButtonDisabled,
                          ]}
                          disabled={item.quantity <= 1}
                        >
                          <Text style={styles.quantityButtonText}>−</Text>
                        </Pressable>
                        <Text style={styles.quantityValue}>
                          {item.quantity}
                        </Text>
                        <Pressable
                          onPress={() =>
                            handleUpdate(
                              item.productId,
                              itemId,
                              item.quantity + 1,
                            )
                          }
                          style={styles.quantityButton}
                        >
                          <Text style={styles.quantityButtonText}>+</Text>
                        </Pressable>
                      </View>
                    </View>
                    <Pressable
                      onPress={() => handleRemove(item.productId, itemId)}
                    >
                      <Text style={styles.remove}>Xóa</Text>
                    </Pressable>
                  </View>
                </Card>
              );
            })}

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Tạm tính ({items.length} sản phẩm)
                </Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(subtotal)}
                </Text>
              </View>
              <AppButton
                title={
                  isAuthenticated ? "Đặt hàng" : "Đăng nhập để thanh toán"
                }
                onPress={() =>
                  router.push(isAuthenticated ? ROUTES.CHECKOUT : ROUTES.LOGIN)
                }
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { gap: 14, paddingHorizontal: 16 },
  title: { color: "#14532d", fontSize: 26, fontWeight: "900" },
  loadingWrapper: { alignItems: "center", paddingVertical: 48, gap: 12 },
  loadingText: { color: "#64748b", fontSize: 14 },
  emptyTitle: {
    color: "#14532d",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  emptyText: { color: "#64748b", lineHeight: 21, marginBottom: 12 },
  list: { gap: 12 },
  itemRow: { flexDirection: "row", gap: 12 },
  itemImage: {
    width: 84,
    height: 84,
    borderRadius: 14,
    backgroundColor: "#e2e8f0",
  },
  itemBody: { flex: 1, gap: 4 },
  itemName: { color: "#0f172a", fontWeight: "800" },
  itemStore: { color: "#64748b", fontSize: 12 },
  itemPrice: { color: "#b91c1c", fontWeight: "800" },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonDisabled: { opacity: 0.4 },
  quantityButtonText: { color: "#166534", fontSize: 18, fontWeight: "900" },
  quantityValue: {
    color: "#0f172a",
    fontWeight: "800",
    minWidth: 20,
    textAlign: "center",
  },
  remove: { color: "#b91c1c", fontWeight: "700", alignSelf: "flex-end" },
  summary: { marginTop: 12 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  summaryLabel: { color: "#334155", fontWeight: "700" },
  summaryValue: { color: "#14532d", fontWeight: "900" },
});
