import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton } from '@/presentation/components';
import { ROUTES } from '@/core/router';
import { formatCurrency } from '@/core/utils';
import type { Product, ProductListResponse } from '@/domain/entities/product.entity';

interface ProductsListPageProps {
  data: ProductListResponse | undefined;
  isLoading: boolean;
  page?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  emptySubMessage?: string;
}

const STATUS_BADGE: Record<Product['status'], { label: string; color: string }> = {
  AVAILABLE: { label: 'Còn hàng', color: '#16a34a' },
  OUT_OF_STOCK: { label: 'Hết hàng', color: '#dc2626' },
  HIDDEN: { label: 'Ẩn', color: '#64748b' },
  PENDING: { label: 'Chờ duyệt', color: '#d97706' },
};

const PLACEHOLDER = 'https://placehold.co/600x400/png?text=Product';

const ProductCard: React.FC<{ item: Product; onPress: () => void }> = ({ item, onPress }) => {
  const badge = STATUS_BADGE[item.status];
  const imageUri = item.images?.[0]?.imageUrl || PLACEHOLDER;
  const hasRating = item.rating !== null && item.rating !== undefined;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      {/* Image + badge */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={[styles.badge, { backgroundColor: badge.color + '22' }]}>
          <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.cardBody}>
        <Text numberOfLines={2} style={styles.name}>
          {item.name}
        </Text>

        <Text style={styles.store} numberOfLines={1}>
          🏪 {item.seller?.storeName || 'Cửa hàng'}
        </Text>

        {hasRating && (
          <View style={styles.ratingRow}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.ratingValue}>
              {item.rating!.toFixed(1)}
              <Text style={styles.ratingCount}> ({item.reviews})</Text>
            </Text>
          </View>
        )}

        <Text style={styles.price}>{formatCurrency(item.price)}</Text>

        <AppButton title="Xem chi tiết" fullWidth onPress={onPress} variant="ghost" />
      </View>
    </Pressable>
  );
};

const Pagination: React.FC<{
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <View style={styles.pagination}>
      <Pressable
        style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
        onPress={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        <Text style={styles.pageBtnText}>‹ Trước</Text>
      </Pressable>

      <Text style={styles.pageInfo}>
        {page} / {totalPages}
      </Text>

      <Pressable
        style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]}
        onPress={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        <Text style={styles.pageBtnText}>Tiếp ›</Text>
      </Pressable>
    </View>
  );
};

export const ProductsListPage: React.FC<ProductsListPageProps> = ({
  data,
  isLoading,
  page,
  onPageChange,
  emptyMessage = 'Không tìm thấy sản phẩm nào',
  emptySubMessage,
}) => {
  const router = useRouter();

  const totalPages = data && page !== undefined ? Math.ceil(data.total / (data.limit || 20)) : 0;

  const goToDetail = (productId: number) =>
    router.push(`${ROUTES.PRODUCTS}/${productId}` as never);

  // ── Loading ──
  if (isLoading) {
    return (
      <View style={styles.centerWrapper}>
        <ActivityIndicator size="large" color="#65a30d" />
        <Text style={styles.muted}>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  // ── Empty ──
  if (!data?.items?.length) {
    return (
      <View style={styles.centerWrapper}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
        {emptySubMessage && <Text style={styles.muted}>{emptySubMessage}</Text>}
      </View>
    );
  }

  return (
    <FlatList
      data={data.items}
      keyExtractor={(item) => String(item.productId)}
      numColumns={2}
      columnWrapperStyle={styles.column}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <ProductCard item={item} onPress={() => goToDetail(item.productId)} />
      )}
      ListHeaderComponent={
        <Text style={styles.resultCount}>{data.total} sản phẩm</Text>
      }
      ListFooterComponent={
        page !== undefined && onPageChange ? (
          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  centerWrapper: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  muted: {
    color: '#64748b',
    fontSize: 13,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 16,
  },

  // Summary
  resultCount: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 8,
  },
  column: {
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d9f99d',
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#84cc16',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 130,
    backgroundColor: '#e2e8f0',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardBody: {
    padding: 10,
    gap: 6,
  },
  name: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 13,
    minHeight: 36,
    lineHeight: 18,
  },
  store: {
    color: '#64748b',
    fontSize: 11,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  star: {
    color: '#f59e0b',
    fontSize: 13,
  },
  ratingValue: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '600',
  },
  ratingCount: {
    color: '#94a3b8',
    fontWeight: '400',
  },
  price: {
    color: '#b91c1c',
    fontWeight: '900',
    fontSize: 14,
  },

  // Pagination
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  pageBtn: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageBtnText: {
    color: '#15803d',
    fontWeight: '700',
    fontSize: 13,
  },
  pageInfo: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
    minWidth: 48,
    textAlign: 'center',
  },
});
