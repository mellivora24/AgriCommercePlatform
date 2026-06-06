import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Screen } from '@/presentation/components';

export const SellerDashboardScreen: React.FC = () => {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Seller Dashboard</Text>
        <Card>
          <Text style={styles.text}>Bảng điều khiển người bán sẽ hiển thị doanh thu, sản phẩm, và đơn hàng.</Text>
        </Card>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { gap: 14 },
  title: { color: '#14532d', fontSize: 26, fontWeight: '900' },
  text: { color: '#64748b', lineHeight: 21 },
});
