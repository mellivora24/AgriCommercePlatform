import React, { useEffect, useRef, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Screen, SearchBar, SectionHeader } from '@/presentation/components';
import {
  useProducts,
  useSearchProducts,
  useToast,
  commerceActions,
} from '@/presentation/hooks';
import { useAuthStore, useCartStore } from '@/core/store';
import { ROUTES } from '@/core/router';
import { formatCurrency } from '@/core/utils';
import type { Product, ProductListResponse } from '@/domain/entities/product.entity';

const STATUS_BADGE: Record<Product['status'], { label: string; color: string }> = {
  AVAILABLE: { label: 'Còn hàng', color: '#16a34a' },
  OUT_OF_STOCK: { label: 'Hết hàng', color: '#dc2626' },
  HIDDEN: { label: 'Ẩn', color: '#64748b' },
  PENDING: { label: 'Chờ duyệt', color: '#d97706' },
};

const PLACEHOLDER = 'https://placehold.co/600x400/png?text=Product';

const SkeletonCard: React.FC<{ index: number }> = ({ index }) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
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

const ProductCard: React.FC<{
  item: Product;
  index: number;
  onPress: () => void;
  onAddToCart: () => void;
}> = ({ item, index, onPress, onAddToCart }) => {
  const badge = STATUS_BADGE[item.status];
  const imageUri = item.images?.[0]?.imageUrl || PLACEHOLDER;
  const isOutOfStock = item.stockQuantity <= 0;
  const isLowStock = !isOutOfStock && item.stockQuantity < 5;
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

  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, speed: 30 }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }).start();

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
      ]}
    >
      {/* Tap card → navigate to detail */}
      <Pressable
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Image */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          {isOutOfStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Hết hàng</Text>
            </View>
          )}
          {/* Status badge */}
          <View style={[styles.badge, { backgroundColor: badge.color + '22' }]}>
            <View style={[styles.badgeDot, { backgroundColor: badge.color }]} />
            <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
          </View>
          {/* Rating badge */}
          {hasRating && !isOutOfStock && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>⭐ {item.rating!.toFixed(1)}</Text>
            </View>
          )}
          {/* Low stock badge */}
          {isLowStock && (
            <View style={styles.lowStockBadge}>
              <Text style={styles.lowStockText}>Còn {item.stockQuantity}</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.cardBody}>
          <Text numberOfLines={2} style={styles.name}>{item.name}</Text>
          <Text style={styles.store} numberOfLines={1}>
            🏪 {item.seller?.storeName || 'Cửa hàng'}
          </Text>
          <Text style={styles.price}>{formatCurrency(item.price)}</Text>
        </View>

        {/* Add to cart button — stopPropagation via its own onPress */}
        <Pressable
          style={[styles.addBtn, isOutOfStock && styles.addBtnDisabled]}
          onPress={(e) => {
            e.stopPropagation?.();
            if (!isOutOfStock) onAddToCart();
          }}
          disabled={isOutOfStock}
        >
          <Text style={[styles.addBtnText, isOutOfStock && styles.addBtnTextDisabled]}>
            {isOutOfStock ? 'Hết hàng' : '+ Thêm vào giỏ'}
          </Text>
        </Pressable>
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

interface ProductsListProps {
  data: ProductListResponse | undefined;
  isLoading: boolean;
  page?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  emptySubMessage?: string;
  onAddToCart: (item: Product) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  data,
  isLoading,
  page,
  onPageChange,
  emptyMessage = 'Không tìm thấy sản phẩm nào',
  emptySubMessage,
  onAddToCart,
}) => {
  const router = useRouter();
  const totalPages =
    data && page !== undefined ? Math.ceil(data.total / (data.limit || 20)) : 0;

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
        <ProductCard
          item={item}
          index={index}
          onPress={() => goToDetail(item.productId)}
          onAddToCart={() => onAddToCart(item)}
        />
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

export const ProductsScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ categoryId?: string; q?: string }>();
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;

  const [searchQuery, setSearchQuery] = useState(params.q ?? '');
  const [debouncedQuery, setDebouncedQuery] = useState(params.q ?? '');
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  const { isAuthenticated, user } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);

  const isBuyer = isAuthenticated && user?.role === 'BUYER';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (params.q) {
      setSearchQuery(params.q);
      setDebouncedQuery(params.q);
    }
  }, [params.q]);

  const isSearching = debouncedQuery.trim().length > 0;

  const { data: listData, isLoading: listLoading } = useProducts(page, 20, categoryId);
  const { data: searchData, isLoading: searchLoading } = useSearchProducts(
    debouncedQuery,
    1,
    20,
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(text);
      setPage(1);
    }, 400);
  };

  const handleClear = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setPage(1);
  };

  const handleAddToCart = async (product: Product) => {
    if (isBuyer) {
      try {
        await commerceActions.addToCart(product.productId, 1);
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        toast.success(`${product.name} đã được thêm vào giỏ hàng`);
      } catch {
        toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
      }
    } else {
      addItem({
        productId: Number(product.productId),
        sellerId: Number(product.seller?.sellerId ?? 0),
        name: product.name,
        price: Number(product.price),
        quantity: 1,
        image: product.images?.[0]?.imageUrl,
        sku: product.categoryId ? `CAT${product.categoryId}` : undefined,
      });
      toast.success(`${product.name} đã được thêm vào giỏ hàng`);
    }
  };

  let HOME_ROUTE = '';
  if (isAuthenticated) {
    if (user?.role === 'SELLER') HOME_ROUTE = ROUTES.SELLER_DASHBOARD;
    else if (user?.role === 'ADMIN') HOME_ROUTE = ROUTES.ADMIN_DASHBOARD;
    else if (user?.role === 'SHIPPER') HOME_ROUTE = ROUTES.SHIPPER_DASHBOARD;
    else HOME_ROUTE = ROUTES.BUYER_HOME;
  }

  return (
    <SafeAreaView style={screen.safe} edges={['top', 'left', 'right']}>
      <Screen>
        <Animated.View
          style={[
            screen.container,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={screen.header}>
            <SectionHeader
              title="Sản phẩm"
              actionLabel="Trang chủ"
              onActionPress={() => router.replace(HOME_ROUTE as any)}
            />
          </View>

          <View style={screen.searchWrapper}>
            <SearchBar
              value={searchQuery}
              onChangeText={handleSearchChange}
              onClear={handleClear}
              placeholder="Tìm kiếm sản phẩm..."
              returnKeyType="search"
            />
          </View>

          <View style={screen.listWrapper}>
            <ProductsList
              data={isSearching ? searchData : listData}
              isLoading={isSearching ? searchLoading : listLoading}
              page={isSearching ? undefined : page}
              onPageChange={isSearching ? undefined : setPage}
              emptyMessage="Không tìm thấy sản phẩm nào"
              emptySubMessage={isSearching ? 'Thử tìm kiếm với từ khóa khác' : undefined}
              onAddToCart={handleAddToCart}
            />
          </View>
        </Animated.View>
      </Screen>
    </SafeAreaView>
  );
};

const screen = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f3f7f1',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  listWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dcfce7',
    overflow: 'hidden',
    shadowColor: '#14532d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 130,
    backgroundColor: '#f0fdf4',
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
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
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  ratingBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400e',
  },
  lowStockBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  lowStockText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400e',
  },
  cardBody: {
    padding: 10,
    gap: 3,
  },
  name: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 13,
    lineHeight: 18,
    minHeight: 36,
  },
  store: {
    color: '#94a3b8',
    fontSize: 11,
  },
  price: {
    color: '#dc2626',
    fontWeight: '900',
    fontSize: 14,
  },
  addBtn: {
    marginHorizontal: 10,
    marginBottom: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#166534',
    alignItems: 'center',
  },
  addBtnDisabled: {
    backgroundColor: '#e2e8f0',
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  addBtnTextDisabled: {
    color: '#94a3b8',
  },
  column: {
    gap: 12,
    marginBottom: 0,
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
  emptyIcon: { fontSize: 34 },
  emptyText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 18,
  },
  skeletonCard: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dcfce7',
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
    height: 130,
    backgroundColor: '#e9f5dc',
  },
  skeletonBody: {
    padding: 10,
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
  pageBtnDisabled: { opacity: 0.35 },
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
