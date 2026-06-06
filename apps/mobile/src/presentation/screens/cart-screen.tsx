import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton, Card, Screen } from '@/presentation/components';
import { useCartStore, useAuthStore } from '@/core/store';
import { formatCurrency } from '@/core/utils';
import { ROUTES } from '@/core/router';

export const CartScreen: React.FC = () => {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateItem = useCartStore((state) => state.updateItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Giỏ hàng</Text>

        {items.length === 0 ? (
          <Card>
            <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
            <Text style={styles.emptyText}>Thêm sản phẩm từ trang chủ hoặc danh sách sản phẩm để bắt đầu đặt hàng.</Text>
            <AppButton title="Tiếp tục mua sắm" onPress={() => router.replace(ROUTES.PRODUCTS)} />
          </Card>
        ) : (
          <View style={styles.list}>
            {items.map((item) => (
              <Card key={item.productId}>
                <View style={styles.itemRow}>
                  <Image
                    source={{ uri: item.image || 'https://placehold.co/128x128/png?text=Item' }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemBody}>
                    <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
                    <View style={styles.quantityRow}>
                      <Pressable onPress={() => updateItem(item.productId, item.quantity - 1)} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>-</Text>
                      </Pressable>
                      <Text style={styles.quantityValue}>{item.quantity}</Text>
                      <Pressable onPress={() => updateItem(item.productId, item.quantity + 1)} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
                <Pressable onPress={() => removeItem(item.productId)}>
                  <Text style={styles.remove}>Xoá sản phẩm</Text>
                </Pressable>
              </Card>
            ))}

            <Card>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tạm tính</Text>
                <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
              </View>
              <AppButton
                title={isAuthenticated ? 'Tiến hành thanh toán' : 'Đăng nhập để thanh toán'}
                onPress={() => router.push(isAuthenticated ? ROUTES.CHECKOUT : ROUTES.LOGIN)}
              />
            </Card>
          </View>
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  title: {
    color: '#14532d',
    fontSize: 26,
    fontWeight: '900',
  },
  emptyTitle: {
    color: '#14532d',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {
    color: '#64748b',
    lineHeight: 21,
    marginBottom: 12,
  },
  list: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 12,
  },
  itemImage: {
    width: 84,
    height: 84,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
  },
  itemBody: {
    flex: 1,
    gap: 8,
  },
  itemName: {
    color: '#0f172a',
    fontWeight: '800',
  },
  itemPrice: {
    color: '#b91c1c',
    fontWeight: '800',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: '#166534',
    fontSize: 18,
    fontWeight: '900',
  },
  quantityValue: {
    color: '#0f172a',
    fontWeight: '800',
    minWidth: 20,
    textAlign: 'center',
  },
  remove: {
    color: '#b91c1c',
    marginTop: 12,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  summaryLabel: {
    color: '#334155',
    fontWeight: '700',
  },
  summaryValue: {
    color: '#14532d',
    fontWeight: '900',
  },
});
