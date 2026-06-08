import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton, AppInput, Card, Screen } from '@/presentation/components';
import { useLogin, useToast } from '@/presentation/hooks';
import { loginSchema, type LoginFormData } from '@/domain/validators/auth.validator';
import { ROUTES } from '@/core/router';
import { SafeAreaView } from 'react-native-safe-area-context';

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { mutate: login, isPending } = useLogin();
  const { control, handleSubmit } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onError: (error: any) => toast.error(error.message || 'Đăng nhập thất bại'),
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Card>
          <View style={styles.header}>
            <Text style={styles.title}>Chào mừng trở lại</Text>
            <Text style={styles.subtitle}>Đăng nhập để tiếp tục mua sắm, quản lý đơn hàng và theo dõi trạng thái.</Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <AppInput
                  label="Địa chỉ Email"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <AppInput
                  label="Mật khẩu"
                  placeholder="••••••••"
                  secureTextEntry
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={error?.message}
                />
              )}
            />

            <AppButton title="Đăng nhập" onPress={handleSubmit(onSubmit)} loading={isPending} />
          </View>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Chưa có tài khoản?</Text>
          <Pressable onPress={() => router.push(ROUTES.REGISTER)}>
            <Text style={styles.link}>Tạo tài khoản</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.replace(ROUTES.HOME_PAGE)}>
          <Text style={styles.guestLink}>Tiếp tục với tư cách khách</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 18,
    paddingHorizontal: 16,
  },
  header: {
    gap: 8,
    marginBottom: 16,
  },
  title: {
    color: '#14532d',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 21,
  },
  form: {
    gap: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  footerText: {
    color: '#64748b',
  },
  link: {
    color: '#15803d',
    fontWeight: '800',
  },
  guestLink: {
    color: '#15803d',
    textAlign: 'center',
    fontWeight: '700',
  },
});
