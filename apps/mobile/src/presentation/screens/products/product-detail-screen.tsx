import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppButton, Card, Screen } from '@/presentation/components';
import { useProductDetail, useToast } from '@/presentation/hooks';
import { useCartStore } from '@/core/store';
import { formatCurrency } from '@/core/utils';
import { ROUTES } from '@/core/router';

export const ProductDetailScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading } = useProductDetail(params.id);
  const addItem = useCartStore((state) => state.addItem);

  if (isLoading || !product) {
    return (
      <Screen>
        <Text style={styles.muted}>Đang tải chi tiết sản phẩm...</Text>
      </Screen>
    );
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.productId,
      sellerId: Number(product.seller?.sellerId || 0),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0]?.imageUrl,
      sku: product.productId.toString(),
    });

    toast.success(`${product.name} đã được thêm vào giỏ hàng`);
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Card>
          <Image
            source={{ uri: product.images?.[0]?.imageUrl || 'https://placehold.co/600x400/png?text=Product' }}
            style={styles.image}
          />
          <View style={styles.meta}>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.store}>{product.seller?.storeName || 'Cửa hàng'}</Text>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          </View>
          <Text style={styles.description}>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Tồn kho: {product.stockQuantity}</Text>
            <Text style={styles.infoText}>⭐ {product.rating ?? 0}</Text>
          </View>
          <AppButton title="Thêm vào giỏ hàng" onPress={handleAddToCart} disabled={product.stockQuantity <= 0} />
        </Card>

        <AppButton title="Quay lại danh sách" variant="ghost" onPress={() => router.replace(ROUTES.PRODUCTS)} />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingBottom: 24,
  },
  muted: {
    color: '#64748b',
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    marginBottom: 14,
  },
  meta: {
    gap: 6,
    marginBottom: 12,
  },
  title: {
    color: '#0f172a',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
  },
  store: {
    color: '#64748b',
  },
  price: {
    color: '#b91c1c',
    fontSize: 20,
    fontWeight: '900',
  },
  description: {
    color: '#334155',
    lineHeight: 22,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  infoText: {
    color: '#14532d',
    fontWeight: '700',
  },
});
