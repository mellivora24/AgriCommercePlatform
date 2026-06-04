import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Card, SectionHeader, AppButton, Screen } from '@/presentation/components';
import { useAuthStore, useCartStore } from '@/core/store';
import { useCategories, useProducts } from '@/presentation/hooks';
import { formatCurrency } from '@/core/utils';
import { ROUTES } from '@/core/router';
import { UserRole } from '@/core/types/enum';
import { useToast } from '@/presentation/hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BANNERS = [
  {
    title: 'Nông sản sạch\ntươi ngon',
    subtitle: 'Trực tiếp từ trang trại đến tay bạn',
    emoji: '🌿',
    gradient: ['#14532d', '#166534'],
    accent: '#4ade80',
  },
  {
    title: 'Rau củ hữu cơ\nan toàn',
    subtitle: 'Không thuốc trừ sâu, không chất bảo quản',
    emoji: '🥦',
    gradient: ['#15803d', '#16a34a'],
    accent: '#86efac',
  },
  {
    title: 'Trái cây tươi\nmỗi ngày',
    subtitle: 'Đảm bảo chất lượng, giao hàng nhanh chóng',
    emoji: '🍎',
    gradient: ['#4d7c0f', '#65a30d'],
    accent: '#d9f99d',
  },
];

// ─── Banner Component ──────────────────────────────────────────────────────────
const BannerCarousel: React.FC<{ onShopPress: () => void }> = ({ onShopPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (activeIndex + 1) % BANNERS.length;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  return (
    <View style={banner.wrapper}>
      <Animated.FlatList
        ref={flatListRef}
        data={BANNERS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setActiveIndex(idx);
        }}
        renderItem={({ item }) => (
          <View style={[banner.slide, { backgroundColor: item.gradient[0] }]}>
            {/* Decorative circle */}
            <View style={banner.circle} />
            <View style={banner.content}>
              <View style={banner.textBlock}>
                <Text style={[banner.tag, { color: item.accent }]}>✦ Mới nhất</Text>
                <Text style={banner.title}>{item.title}</Text>
                <Text style={banner.subtitle}>{item.subtitle}</Text>
                <Pressable
                  style={[banner.cta, { backgroundColor: item.accent }]}
                  onPress={onShopPress}
                >
                  <Text style={[banner.ctaText, { color: item.gradient[0] }]}>Mua ngay →</Text>
                </Pressable>
              </View>
              <Text style={banner.emoji}>{item.emoji}</Text>
            </View>
          </View>
        )}
      />
      {/* Dots */}
      <View style={banner.dots}>
        {BANNERS.map((_, i) => (
          <Pressable key={i} onPress={() => {
            flatListRef.current?.scrollToIndex({ index: i, animated: true });
            setActiveIndex(i);
          }}>
            <View style={[banner.dot, activeIndex === i && banner.dotActive]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

// ─── Product Card ──────────────────────────────────────────────────────────────
const ProductCard: React.FC<{
  product: any;
  onPress: () => void;
  onAddToCart: () => void;
}> = ({ product, onPress, onAddToCart }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 5;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '48%' }}>
      <Pressable
        style={pc.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={pc.imageContainer}>
          <Image
            source={{ uri: product.images?.[0]?.imageUrl || 'https://placehold.co/400x400/e2e8f0/64748b?text=🌿' }}
            style={pc.image}
          />
          {isOutOfStock && (
            <View style={pc.outOfStockOverlay}>
              <Text style={pc.outOfStockText}>Hết hàng</Text>
            </View>
          )}
          {!isOutOfStock && (
            <View style={pc.ratingBadge}>
              <Text style={pc.ratingText}>⭐ {product.rating ?? 0}</Text>
            </View>
          )}
          {isLowStock && (
            <View style={pc.lowStockBadge}>
              <Text style={pc.lowStockText}>Còn {product.stockQuantity}</Text>
            </View>
          )}
        </View>

        <View style={pc.info}>
          <Text numberOfLines={2} style={pc.name}>{product.name}</Text>
          <Text numberOfLines={1} style={pc.store}>🏪 {product.seller?.storeName || 'Cửa hàng'}</Text>
          <Text style={pc.price}>{formatCurrency(product.price)}</Text>
        </View>

        <Pressable
          style={[pc.addBtn, isOutOfStock && pc.addBtnDisabled]}
          onPress={onAddToCart}
          disabled={isOutOfStock}
        >
          <Text style={[pc.addBtnText, isOutOfStock && pc.addBtnTextDisabled]}>
            {isOutOfStock ? 'Hết hàng' : '+ Thêm vào giỏ'}
          </Text>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
};

// ─── Main HomeScreen ───────────────────────────────────────────────────────────
export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const user = useAuthStore((state) => state.user);
  const addItem = useCartStore((state) => state.addItem);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: products, isLoading: productsLoading } = useProducts(1, 8);

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

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.page}
      >
        {/* ── BANNER ── */}
        <BannerCarousel onShopPress={() => router.push(ROUTES.PRODUCTS)} />

        {/* ── CATEGORIES ── */}
        <View style={s.section}>
          <SectionHeader
            title="Danh mục sản phẩm"
            onActionPress={() => router.push(ROUTES.PRODUCTS)}
          />
          {categoriesLoading ? (
            <View style={s.skeletonRow}>
              {[...Array(4)].map((_, i) => (
                <View key={i} style={s.categorySkeleton} />
              ))}
            </View>
          ) : (
            <FlatList
              data={categories ?? []}
              horizontal
              keyExtractor={(item) => String(item.categoryId)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.catList}
              renderItem={({ item }) => (
                <Pressable
                  style={s.catChip}
                  onPress={() => router.push(`${ROUTES.PRODUCTS}?categoryId=${item.categoryId}`)}
                >
                  <Text style={s.catText}>{item.name}</Text>
                </Pressable>
              )}
            />
          )}
        </View>

        {/* ── FEATURED PRODUCTS ── */}
        <View style={s.section}>
          <SectionHeader
            title="Sản phẩm nổi bật"
            actionLabel="Xem tất cả"
            onActionPress={() => router.push(ROUTES.PRODUCTS)}
          />
          {productsLoading ? (
            <View style={s.productGrid}>
              {[...Array(4)].map((_, i) => (
                <View key={i} style={[s.productSkeleton, { width: '48%' }]} />
              ))}
            </View>
          ) : (
            <View style={s.productGrid}>
              {products?.items.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  onPress={() => router.push(`${ROUTES.PRODUCTS}/${product.productId}`)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </View>
          )}
        </View>

        <Text style={{ textAlign: 'center', color: '#94a3b8', marginVertical: 20, paddingHorizontal: 32 }}>
          Bạn đã xem hết sản phẩm nổi bật. Hãy khám phá thêm nhiều sản phẩm khác trong cửa hàng!
        </Text>
      </ScrollView>
    </Screen>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const banner = StyleSheet.create({
  wrapper: {
    marginHorizontal: 0,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: 230,
    overflow: 'hidden',
    // position: 'relative',
  },
  circle: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  textBlock: {
    flex: 1,
    gap: 6,
  },
  tag: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    lineHeight: 16,
  },
  cta: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 32,
    marginTop: 12,
  },
  ctaText: {
    fontWeight: '800',
    fontSize: 13,
  },
  emoji: {
    fontSize: 64,
    marginLeft: 12,
  },
  dots: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#ffffff',
  },
});

const pc = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dcfce7',
    overflow: 'hidden',
    shadowColor: '#14532d',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  imageContainer: {
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
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400e',
  },
  lowStockBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
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
  info: {
    padding: 10,
    gap: 3,
  },
  name: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 18,
  },
  store: {
    fontSize: 11,
    color: '#94a3b8',
  },
  price: {
    fontSize: 14,
    fontWeight: '900',
    color: '#dc2626',
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
});

const s = StyleSheet.create({
  page: {
    paddingTop: 0,
    gap: 0,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
  },
  catList: {
    gap: 8,
    paddingRight: 16,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#bbf7d0',
    shadowColor: '#14532d',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  catEmoji: {
    fontSize: 14,
  },
  catText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '700',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categorySkeleton: {
    height: 38,
    width: 90,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
  },
  productSkeleton: {
    height: 220,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  qaCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  qaIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  qaLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#14532d',
  },
  qaDesc: {
    fontSize: 11,
    color: '#4b7c5e',
    lineHeight: 15,
  },
  greetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dcfce7',
    padding: 16,
    gap: 14,
    shadowColor: '#14532d',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  greetLeft: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetEmoji: {
    fontSize: 26,
  },
  greetRight: {
    flex: 1,
    gap: 4,
  },
  greetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#14532d',
  },
  greetSub: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
  },
});
