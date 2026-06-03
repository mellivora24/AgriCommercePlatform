import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppButton, Card, Screen, SectionHeader } from '@/presentation/components';
import { useProducts } from '@/presentation/hooks';
import { ROUTES } from '@/core/router';
import { formatCurrency } from '@/core/utils';

export const ProductsScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;
  const { data, isLoading } = useProducts(1, 20, categoryId);

  return (
    <Screen>
      <View style={styles.container}>
        <SectionHeader title="Sản phẩm" actionLabel="Trang chủ" onActionPress={() => router.replace(ROUTES.HOME_PAGE)} />
        {isLoading ? (
          <Text style={styles.muted}>Đang tải sản phẩm...</Text>
        ) : (
          <FlatList
            data={data?.items ?? []}
            keyExtractor={(item) => String(item.productId)}
            numColumns={2}
            columnWrapperStyle={styles.column}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Pressable style={styles.card} onPress={() => router.push(`${ROUTES.PRODUCTS}/${item.productId}`)}>
                <Image
                  source={{ uri: item.images?.[0]?.imageUrl || 'https://placehold.co/600x400/png?text=Product' }}
                  style={styles.image}
                />
                <Text numberOfLines={2} style={styles.name}>{item.name}</Text>
                <Text style={styles.store}>{item.seller?.storeName || 'Cửa hàng'}</Text>
                <Text style={styles.price}>{formatCurrency(item.price)}</Text>
                <AppButton
                  title="Chi tiết"
                  fullWidth
                  onPress={() => router.push(`${ROUTES.PRODUCTS}/${item.productId}`)}
                  variant="ghost"
                />
              </Pressable>
            )}
          />
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  muted: {
    color: '#64748b',
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
    padding: 10,
    gap: 8,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 130,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
  },
  name: {
    color: '#0f172a',
    fontWeight: '800',
    minHeight: 40,
  },
  store: {
    color: '#64748b',
    fontSize: 12,
  },
  price: {
    color: '#b91c1c',
    fontWeight: '900',
  },
});
