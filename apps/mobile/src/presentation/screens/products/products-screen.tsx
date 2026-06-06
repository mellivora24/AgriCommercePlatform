import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
    <Screen>
      <View style={styles.container}>
        <SectionHeader
          title="Sản phẩm"
          actionLabel="Trang chủ"
          onActionPress={() => router.replace(ROUTES.HOME_PAGE)}
        />

        <SearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          onClear={handleClear}
          placeholder="Tìm kiếm sản phẩm..."
          returnKeyType="search"
        />

        <ProductsListPage
          data={isSearching ? searchData : listData}
          isLoading={isSearching ? searchLoading : listLoading}
          page={isSearching ? undefined : page}
          onPageChange={isSearching ? undefined : setPage}
          emptyMessage="Không tìm thấy sản phẩm nào"
          emptySubMessage={isSearching ? 'Thử tìm kiếm với từ khóa khác' : undefined}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
});
