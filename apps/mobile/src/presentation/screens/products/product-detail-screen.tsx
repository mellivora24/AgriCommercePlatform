import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppButton, Card, Screen } from '@/presentation/components';
import { useProductDetail, useToast } from '@/presentation/hooks';
import { useCartStore } from '@/core/store';
import { formatCurrency } from '@/core/utils';
import { ROUTES } from '@/core/router';

const SkeletonDetail: React.FC = () => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.85] });

  return (
    <Animated.View style={[styles.skeletonWrapper, { opacity }]}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonBody}>
        <View style={[styles.skeletonLine, { width: '80%', height: 22 }]} />
        <View style={[styles.skeletonLine, { width: '40%', height: 14 }]} />
        <View style={[styles.skeletonLine, { width: '35%', height: 20, backgroundColor: '#fecaca' }]} />
        <View style={[styles.skeletonLine, { width: '100%', height: 12 }]} />
        <View style={[styles.skeletonLine, { width: '90%', height: 12 }]} />
        <View style={[styles.skeletonLine, { width: '70%', height: 12 }]} />
      </View>
    </Animated.View>
  );
};

export const ProductDetailScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading } = useProductDetail(params.id);
  const addItem = useCartStore((state) => state.addItem);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!isLoading && product) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: true }),
      ]).start();
    }
  }, [isLoading, product]);

  if (isLoading || !product) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <Screen>
          <View style={styles.skeletonContainer}>
            <SkeletonDetail />
          </View>
        </Screen>
      </SafeAreaView>
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

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Screen>
        <Animated.View
          style={[{ flex: 1 }, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.heroWrapper}>
              <Image
                source={{
                  uri: product.images?.[0]?.imageUrl || 'https://placehold.co/600x400/png?text=Product',
                }}
                style={styles.image}
              />
              <View style={[styles.stockPill, isOutOfStock && styles.stockPillOut]}>
                <View style={[styles.stockDot, isOutOfStock && styles.stockDotOut]} />
                <Text style={[styles.stockPillText, isOutOfStock && styles.stockPillTextOut]}>
                  {isOutOfStock ? 'Hết hàng' : `Còn ${product.stockQuantity} sản phẩm`}
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.title}>{product.name}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.store}>🏪 {product.seller?.storeName || 'Cửa hàng'}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingStar}>★</Text>
                  <Text style={styles.ratingNum}>{product.rating ?? 0}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            </View>

            <View style={styles.descCard}>
              <View style={styles.descHeader}>
                <View style={styles.descAccent} />
                <Text style={styles.descLabel}>Mô tả sản phẩm</Text>
              </View>
              <Text style={styles.description}>
                {product.description || 'Chưa có mô tả cho sản phẩm này.'}
              </Text>
            </View>

            <View style={styles.actionCard}>
              <Pressable
                style={({ pressed }) => [
                  styles.addCartBtn,
                  isOutOfStock && styles.addCartBtnDisabled,
                  pressed && !isOutOfStock && styles.addCartBtnPressed,
                ]}
                onPress={handleAddToCart}
                disabled={isOutOfStock}
              >
                <Text style={styles.addCartText}>
                  {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
                onPress={() => router.replace(ROUTES.PRODUCTS)}
              >
                <Text style={styles.backText}>← Quay lại danh sách</Text>
              </Pressable>
            </View>
          </ScrollView>
        </Animated.View>
      </Screen>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f3f7f1',
  },
  content: {
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  heroWrapper: {
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#65a30d',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: '#e2e8f0',
  },
  stockPill: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stockPillOut: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecaca',
  },
  stockDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#16a34a',
  },
  stockDotOut: {
    backgroundColor: '#dc2626',
  },
  stockPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
  },
  stockPillTextOut: {
    color: '#dc2626',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#d9f99d',
    gap: 10,
    shadowColor: '#65a30d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    color: '#0f172a',
    fontSize: 26,
    lineHeight: 33,
    fontWeight: '900',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  store: {
    color: '#64748b',
    fontSize: 14,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fefce8',
    borderWidth: 1,
    borderColor: '#fef08a',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  ratingStar: {
    color: '#f59e0b',
    fontSize: 14,
  },
  ratingNum: {
    color: '#92400e',
    fontWeight: '700',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0fdf4',
    borderRadius: 1,
  },
  price: {
    color: '#b91c1c',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  descCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  descHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  descAccent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: '#84cc16',
  },
  descLabel: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 17,
  },
  description: {
    color: '#334155',
    lineHeight: 22,
    fontSize: 14,
  },
  actionCard: {
    gap: 10,
  },
  addCartBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  addCartBtnDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  addCartBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  addCartText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 17,
  },
  backBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  backBtnPressed: {
    opacity: 0.7,
  },
  backText: {
    color: '#15803d',
    fontWeight: '700',
    fontSize: 15,
  },
  skeletonContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  skeletonWrapper: {
    gap: 14,
  },
  skeletonImage: {
    width: '100%',
    height: 280,
    borderRadius: 24,
    backgroundColor: '#e9f5dc',
  },
  skeletonBody: {
    gap: 12,
    padding: 4,
  },
  skeletonLine: {
    height: 14,
    borderRadius: 7,
    backgroundColor: '#e2e8f0',
  },
});