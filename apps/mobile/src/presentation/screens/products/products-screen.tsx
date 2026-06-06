import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, SearchBar, SectionHeader } from '@/presentation/components';
import { ProductsListPage } from '@/presentation/screens/products/products-list-page';
import { useProducts, useSearchProducts } from '@/presentation/hooks';
import { ROUTES } from '@/core/router';

export const ProductsScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ categoryId?: string; q?: string }>();
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;

  const [searchQuery, setSearchQuery] = useState(params.q ?? '');
  const [debouncedQuery, setDebouncedQuery] = useState(params.q ?? '');
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

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
  const { data: searchData, isLoading: searchLoading } = useSearchProducts(debouncedQuery, 1, 20);

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

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Screen>
        <Animated.View
          style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.header}>
            <SectionHeader
              title="Sản phẩm"
              actionLabel="Trang chủ"
              onActionPress={() => router.replace(ROUTES.HOME_PAGE)}
            />
          </View>

          <View style={styles.searchWrapper}>
            <SearchBar
              value={searchQuery}
              onChangeText={handleSearchChange}
              onClear={handleClear}
              placeholder="Tìm kiếm sản phẩm..."
              returnKeyType="search"
            />
          </View>

          <View style={styles.listWrapper}>
            <ProductsListPage
              data={isSearching ? searchData : listData}
              isLoading={isSearching ? searchLoading : listLoading}
              page={isSearching ? undefined : page}
              onPageChange={isSearching ? undefined : setPage}
              emptyMessage="Không tìm thấy sản phẩm nào"
              emptySubMessage={isSearching ? 'Thử tìm kiếm với từ khóa khác' : undefined}
            />
          </View>
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
