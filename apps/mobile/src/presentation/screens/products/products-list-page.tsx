import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
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

const ProductCard: React.FC<{ item: Product; onPress: () => void; index: number }> = ({
  item,
  onPress,
  index,
}) => {
  const badge = STATUS_BADGE[item.status];
  const imageUri = item.images?.[0]?.imageUrl || PLACEHOLDER;
  const hasRating = item.rating !== null && item.rating !== undefined;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    const delay = index * 60;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 360, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 360, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, speed: 30 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  };

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
      ]}
    >
      <Pressable
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <View style={styles.imageOverlay} />
          <View style={[styles.badge, { backgroundColor: badge.color + '22' }]}>
            <View style={[styles.badgeDot, { backgroundColor: badge.color }]} />
            <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
          </View>
        </View>

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
    </Animated.View>
  );
};

const Pagination: React.FC<{
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const dots = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    let pageNum = i + 1;
    if (totalPages > 5) {
      const start = Math.max(1, Math.min(page - 2, totalPages - 4));
      pageNum = start + i;
    }
    return pageNum;
  });

  return (
    <View style={styles.pagination}>
      <Pressable
        style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
        onPress={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        <Text style={styles.pageBtnText}>‹</Text>
      </Pressable>

      <View style={styles.pageDots}>
        {dots.map((p) => (
          <Pressable
            key={p}
            onPress={() => onPageChange(p)}
            style={[styles.pageDot, p === page && styles.pageDotActive]}
          >
            <Text style={p === page ? styles.pageDotActiveText : styles.pageDotText}>{p}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]}
        onPress={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        <Text style={styles.pageBtnText}>›</Text>
      </Pressable>
    </View>
  );
};

const SkeletonCard: React.FC<{ index: number }> = ({ index }) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, delay: index * 100, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.85] });

  return (
    <Animated.View style={[styles.cardWrapper, styles.skeletonCard, { opacity }]}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonBody}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: '60%' }]} />
        <View style={[styles.skeletonLine, { width: '40%', backgroundColor: '#d9f99d' }]} />
      </View>
    </Animated.View>
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

  if (isLoading) {
    return (
      <View>
        <View style={styles.skeletonCountBar} />
        <View style={styles.column}>
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} index={i} />
          ))}
        </View>
        <View style={styles.centerWrapper}>
          <ActivityIndicator size="small" color="#65a30d" />
          <Text style={styles.muted}>Đang tải sản phẩm...</Text>
        </View>
      </View>
    );
  }

  if (!data?.items?.length) {
    return (
      <View style={styles.centerWrapper}>
        <View style={styles.emptyIconWrapper}>
          <Text style={styles.emptyIcon}>📦</Text>
        </View>
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
      renderItem={({ item, index }) => (
        <ProductCard item={item} onPress={() => goToDetail(item.productId)} index={index} />
      )}
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <View style={styles.listHeaderAccent} />
          <Text style={styles.resultCount}>{data.total} sản phẩm</Text>
        </View>
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
  emptyIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f0fdf4',
    borderWidth: 2,
    borderColor: '#bbf7d0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyIcon: {
    fontSize: 34,
  },
  emptyText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 18,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  listHeaderAccent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: '#84cc16',
  },
  resultCount: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '700',
  },
  column: {
    gap: 12,
    marginBottom: 0,
  },
  cardWrapper: {
    flex: 1,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d9f99d',
    overflow: 'hidden',
    shadowColor: '#65a30d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#e2e8f0',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardBody: {
    padding: 12,
    gap: 6,
  },
  name: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 14,
    minHeight: 38,
    lineHeight: 19,
  },
  store: {
    color: '#64748b',
    fontSize: 12,
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
    fontSize: 15,
  },
  skeletonCard: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d9f99d',
    overflow: 'hidden',
  },
  skeletonCountBar: {
    height: 14,
    width: 100,
    borderRadius: 7,
    backgroundColor: '#e2e8f0',
    marginBottom: 12,
  },
  skeletonImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#e9f5dc',
  },
  skeletonBody: {
    padding: 12,
    gap: 8,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  pageBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBtnDisabled: {
    opacity: 0.35,
  },
  pageBtnText: {
    color: '#15803d',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 22,
  },
  pageDots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  pageDot: {
    minWidth: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pageDotActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  pageDotText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  pageDotActiveText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
