import React, { useMemo } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, SectionHeader, AppButton, Screen } from '@/presentation/components';
import { useAuthStore, useCartStore } from '@/core/store';
import { useCategories, useProducts } from '@/presentation/hooks';
import { formatCurrency } from '@/core/utils';
import { ROUTES } from '@/core/router';
import { UserRole } from '@/core/types/enum';
import { useToast } from '@/presentation/hooks';

const BANNERS = [
  {
    title: 'Nông sản sạch tươi ngon',
    subtitle: 'Trực tiếp từ trang trại đến tay bạn',
    accent: '#166534',
  },
  {
    title: 'Rau củ hữu cơ an toàn',
    subtitle: 'Không thuốc trừ sâu, không chất bảo quản',
    accent: '#15803d',
  },
  {
    title: 'Trái cây tươi mỗi ngày',
    subtitle: 'Đảm bảo chất lượng, giao hàng nhanh chóng',
    accent: '#65a30d',
  },
];

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const user = useAuthStore((state) => state.user);
  const addItem = useCartStore((state) => state.addItem);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: products, isLoading: productsLoading } = useProducts(1, 8);

  const banner = useMemo(() => BANNERS[0], []);

  const handleAddToCart = (product: any) => {
    addItem({
      productId: Number(product.productId),
      sellerId: Number(product.seller?.sellerId || 0),
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      image: product.images?.[0]?.imageUrl,
      sku: product.sku,
    });

    toast.success(`${product.name} đã được thêm vào giỏ hàng`);
  };

  const headerActions = [
    { label: 'Sản phẩm', onPress: () => router.push(ROUTES.PRODUCTS) },
    { label: 'Đơn hàng', onPress: () => router.push(ROUTES.ORDERS) },
  ];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
        <Card>
          <View style={[styles.banner, { backgroundColor: banner.accent }]}>
            <Text style={styles.bannerTitle}>{banner.title}</Text>
            <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
            <View style={styles.bannerActions}>
              {headerActions.map((action) => (
                <AppButton
                  key={action.label}
                  title={action.label}
                  variant="secondary"
                  fullWidth={false}
                  onPress={action.onPress}
                  style={styles.bannerButton}
                />
              ))}
            </View>
          </View>
        </Card>

        <View style={styles.sectionGap}>
          <SectionHeader title="Danh mục sản phẩm" />
          {categoriesLoading ? (
            <Text style={styles.muted}>Đang tải danh mục...</Text>
          ) : (
            <FlatList
              data={categories ?? []}
              horizontal
              keyExtractor={(item) => String(item.categoryId)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.categoryChip}
                  onPress={() => router.push(`${ROUTES.PRODUCTS}?categoryId=${item.categoryId}`)}
                >
                  <Text style={styles.categoryText}>{item.name}</Text>
                </Pressable>
              )}
            />
          )}
        </View>

        <View style={styles.sectionGap}>
          <SectionHeader title="Sản phẩm nổi bật" actionLabel="Xem tất cả" onActionPress={() => router.push(ROUTES.PRODUCTS)} />
          {productsLoading ? (
            <Text style={styles.muted}>Đang tải sản phẩm...</Text>
          ) : (
            <View style={styles.productGrid}>
              {products?.items.map((product) => (
                <Pressable
                  key={product.productId}
                  style={styles.productCard}
                  onPress={() => router.push(`${ROUTES.PRODUCTS}/${product.productId}`)}
                >
                  <Image
                    source={{ uri: product.images?.[0]?.imageUrl || 'https://placehold.co/600x400/png?text=Product' }}
                    style={styles.productImage}
                  />
                  <Text numberOfLines={2} style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productStore}>{product.seller?.storeName || 'Cửa hàng'}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
                    <Text style={styles.rating}>⭐ {product.rating ?? 0}</Text>
                  </View>
                  <AppButton
                    title="Thêm vào giỏ"
                    fullWidth
                    onPress={() => handleAddToCart(product)}
                    variant={product.stockQuantity > 0 ? 'primary' : 'ghost'}
                    disabled={product.stockQuantity <= 0}
                  />
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.sectionGap}>
          <Card>
            <Text style={styles.profileTitle}>Xin chào {user?.name || 'khách'}</Text>
            <Text style={styles.muted}>
              {user?.role === UserRole.BUYER || !user ? 'Hãy khám phá sản phẩm tươi sạch dành cho bạn.' : 'Bảng điều khiển của bạn sẽ hiển thị theo vai trò.'}
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  page: {
    gap: 16,
    paddingBottom: 24,
  },
  banner: {
    borderRadius: 18,
    padding: 18,
    gap: 10,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
  },
  bannerSubtitle: {
    color: '#f8fafc',
    fontSize: 14,
  },
  bannerActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  bannerButton: {
    minWidth: 120,
  },
  sectionGap: {
    gap: 10,
  },
  muted: {
    color: '#64748b',
    fontSize: 14,
  },
  horizontalList: {
    gap: 10,
    paddingRight: 4,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  categoryText: {
    color: '#166534',
    fontWeight: '700',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  productCard: {
    width: '48%',
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d9f99d',
    padding: 10,
    gap: 8,
  },
  productImage: {
    width: '100%',
    height: 128,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
  },
  productName: {
    color: '#0f172a',
    fontWeight: '800',
    minHeight: 40,
  },
  productStore: {
    color: '#64748b',
    fontSize: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    color: '#b91c1c',
    fontWeight: '900',
    fontSize: 14,
  },
  rating: {
    color: '#ca8a04',
    fontWeight: '700',
    fontSize: 12,
  },
  profileTitle: {
    color: '#14532d',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
});
