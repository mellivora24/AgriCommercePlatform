import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton, AppInput, Card, Screen } from '@/presentation/components';
import { useRegister, useToast } from '@/presentation/hooks';
import { registerSchema, type RegisterFormData } from '@/domain/validators/auth.validator';
import { ROUTES } from '@/core/router';
import { SafeAreaView } from 'react-native-safe-area-context';

export const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { mutate: register, isPending } = useRegister();
  const [pendingData, setPendingData] = useState<RegisterFormData | null>(null);
  const [showSellerModal, setShowSellerModal] = useState(false);

  const { control, handleSubmit, setValue, watch } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'BUYER' },
  });

  const role = watch('role');

  const submitRegistration = (data: RegisterFormData) => {
    register(data, {
      onError: (error: any) => toast.error(error.message || 'Đăng ký thất bại'),
    });
  };

  const onSubmit = (data: RegisterFormData) => {
    if (data.role === 'SELLER') {
      setPendingData(data);
      setShowSellerModal(true);
      return;
    }

    submitRegistration(data);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal visible={showSellerModal} transparent animationType="fade" onRequestClose={() => setShowSellerModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Lưu ý khi đăng ký tài khoản Người Bán</Text>
            <Text style={styles.modalText}>
              Yêu cầu đăng ký của bạn sẽ được ADMIN hệ thống duyệt trong vòng 3 ngày làm việc.
            </Text>
            <View style={styles.modalActions}>
              <AppButton title="Huỷ" variant="ghost" fullWidth={false} onPress={() => setShowSellerModal(false)} style={styles.modalButton} />
              <AppButton
                title="Tôi đã hiểu"
                fullWidth={false}
                onPress={() => {
                  setShowSellerModal(false);
                  if (pendingData) {
                    submitRegistration(pendingData);
                    setPendingData(null);
                  }
                }}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        <Card>
          <View style={styles.header}>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>Đăng ký để mua hàng, quản lý đơn, hoặc đăng ký vai trò người bán.</Text>
          </View>

          <View style={styles.roleRow}>
            {[
              { value: 'BUYER', label: 'Buyer' },
              { value: 'SELLER', label: 'Seller' },
            ].map((item) => (
              <Pressable
                key={item.value}
                style={[styles.roleChip, role === item.value && styles.roleChipActive]}
                onPress={() => {
                  setValue('role', item.value as RegisterFormData['role']);
                }}
              >
                <Text style={[styles.roleText, role === item.value && styles.roleTextActive]}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <AppInput label="Họ và tên" placeholder="Nguyễn Văn A" value={value} onBlur={onBlur} onChangeText={onChange} error={error?.message} />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <AppInput label="Địa chỉ Email" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" value={value} onBlur={onBlur} onChangeText={onChange} error={error?.message} />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <AppInput label="Mật khẩu" placeholder="••••••••" secureTextEntry value={value} onBlur={onBlur} onChangeText={onChange} error={error?.message} />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <AppInput label="Xác nhận mật khẩu" placeholder="••••••••" secureTextEntry value={value} onBlur={onBlur} onChangeText={onChange} error={error?.message} />
              )}
            />

            <AppButton title="Đăng ký" onPress={handleSubmit(onSubmit)} loading={isPending} />
          </View>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Đã có tài khoản?</Text>
          <Pressable onPress={() => router.push(ROUTES.LOGIN)}>
            <Text style={styles.link}>Đăng nhập</Text>
          </Pressable>
        </View>
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
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 21,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  roleChip: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  roleChipActive: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
  },
  roleText: {
    color: '#166534',
    fontWeight: '800',
  },
  roleTextActive: {
    color: '#14532d',
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 14,
  },
  modalTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalText: {
    color: '#475569',
    textAlign: 'center',
    lineHeight: 21,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
  },
});
