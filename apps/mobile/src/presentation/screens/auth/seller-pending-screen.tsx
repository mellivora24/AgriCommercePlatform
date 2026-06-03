import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Screen } from '@/presentation/components';
import { ROUTES } from '@/core/router';

export const SellerPendingScreen: React.FC = () => {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.container}>
        <Card>
          <View style={styles.content}>
            <Text style={styles.title}>Đăng ký thành công</Text>
            <Text style={styles.subtitle}>
              Tài khoản Người Bán của bạn đã được ghi nhận. ADMIN hệ thống sẽ xét duyệt trong vòng 3 ngày làm việc.
            </Text>
            <View style={styles.steps}>
              {[
                'Hệ thống ghi nhận yêu cầu đăng ký của bạn',
                'ADMIN xem xét và xác minh thông tin',
                'Bạn nhận email thông báo kết quả duyệt',
                'Đăng nhập và bắt đầu bán hàng',
              ].map((step, index) => (
                <Text key={step} style={styles.step}>• {index + 1}. {step}</Text>
              ))}
            </View>
          </View>
        </Card>

        <Pressable onPress={() => router.replace(ROUTES.LOGIN)}>
          <Text style={styles.link}>Quay lại trang đăng nhập</Text>
        </Pressable>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 18,
  },
  content: {
    gap: 14,
  },
  title: {
    color: '#14532d',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  steps: {
    gap: 8,
  },
  step: {
    color: '#475569',
    lineHeight: 20,
  },
  link: {
    color: '#15803d',
    textAlign: 'center',
    fontWeight: '800',
  },
});
