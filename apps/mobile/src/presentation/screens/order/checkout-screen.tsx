import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  Modal,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useCreateOrder, useCartQuery } from "@/presentation/hooks/useCommerce";
import type { CreateOrderPayload } from "@/domain/repositories/order.repository";
import { formatCurrency } from "@/core/utils/format";

const BANK_NAME = process.env.EXPO_PUBLIC_BANK_NAME ?? "Vietcombank";
const BANK_ACCOUNT = process.env.EXPO_PUBLIC_BANK_ACCOUNT ?? "1021576686";
const BANK_OWNER = process.env.EXPO_PUBLIC_BANK_OWNER ?? "Chu Tai Khoan";
const QR_COUNTDOWN = 60;

const buildQrUrl = (ref: string) =>
  `https://api.vietqr.io/${BANK_NAME}/${BANK_ACCOUNT}/${encodeURIComponent(`Thanh toan don hang ${ref}`)}/compact.jpg?accountName=${encodeURIComponent(BANK_OWNER)}`;

const Field: React.FC<{
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: "default" | "phone-pad";
}> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
}) => (
  <View style={s.field}>
    <Text style={s.fieldLabel}>{label}</Text>
    <TextInput
      style={s.fieldInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#C4C4C4"
      keyboardType={keyboardType}
      autoCapitalize="none"
    />
  </View>
);

const QrModal: React.FC<{
  visible: boolean;
  paymentRef: string;
  amount: number;
  onConfirm: () => void;
  onClose: () => void;
}> = ({ visible, paymentRef, amount, onConfirm, onClose }) => {
  const [seconds, setSeconds] = useState(QR_COUNTDOWN);
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;
    setSeconds(QR_COUNTDOWN);
    progress.setValue(1);
    Animated.timing(progress, {
      toValue: 0,
      duration: QR_COUNTDOWN * 1000,
      useNativeDriver: false,
    }).start();
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
      progress.stopAnimation();
    };
  }, [visible]);

  const urgent = seconds <= 10;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={qr.overlay}>
        <View style={qr.sheet}>
          <View style={qr.drag} />
          <View style={qr.sheetHeader}>
            <Text style={qr.title}>Quét QR thanh toán</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Text style={qr.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={qr.bankInfo}>
            <Text style={qr.bankName}>{BANK_NAME}</Text>
            <Text style={qr.bankAccount}>
              STK: {BANK_ACCOUNT} · {BANK_OWNER}
            </Text>
            <Text style={qr.bankAmount}>{formatCurrency(amount)}</Text>
          </View>

          <View style={qr.qrWrapper}>
            <Image
              source={{ uri: buildQrUrl(paymentRef) }}
              style={qr.qrImg}
              resizeMode="contain"
            />
          </View>

          <Text style={qr.qrNote}>
            Nội dung:{" "}
            <Text style={{ fontWeight: "700" }}>
              Thanh toan don hang {paymentRef}
            </Text>
          </Text>

          <View style={qr.timerRow}>
            <View style={qr.timerTrack}>
              <Animated.View
                style={[
                  qr.timerFill,
                  {
                    width: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                    backgroundColor: urgent ? "#EF4444" : "#6366F1",
                  },
                ]}
              />
            </View>
            <Text style={[qr.timerText, urgent && { color: "#EF4444" }]}>
              {seconds}s
            </Text>
          </View>

          <TouchableOpacity
            style={qr.confirmBtn}
            onPress={onConfirm}
            activeOpacity={0.85}
          >
            <Text style={qr.confirmText}>Đã chuyển khoản thành công</Text>
          </TouchableOpacity>
          <Text style={qr.devNote}>* Chỉ dùng để test</Text>
        </View>
      </View>
    </Modal>
  );
};

export default function CheckoutScreen() {
  const router = useRouter();
  const { data: cartData, isLoading: cartLoading } = useCartQuery();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const cartItems = cartData?.items ?? [];

  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [showQr, setShowQr] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const paymentRef = useRef(`TMP-${Date.now()}`);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
      ),
    [cartItems],
  );

  const validate = () => {
    if (!receiverName.trim()) {
      setErrorMsg("Vui lòng nhập tên người nhận");
      return false;
    }
    if (!receiverPhone.trim()) {
      setErrorMsg("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!shippingAddress.trim()) {
      setErrorMsg("Vui lòng nhập địa chỉ giao hàng");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const submitOrder = () => {
    const payload: CreateOrderPayload = {
      receiverName: receiverName.trim(),
      receiverPhone: receiverPhone.trim(),
      shippingAddress: shippingAddress.trim(),
      paymentMethod,
    };
    createOrder(payload, {
      onSuccess: (orders) => {
        const firstId = orders?.[0]?.orderId;
        if (firstId) router.replace(`/orders/${firstId}`);
        else router.replace("/orders");
      },
      onError: (err) => {
        setErrorMsg(
          err instanceof Error ? err.message : "Không thể tạo đơn hàng",
        );
      },
    });
  };

  const handleCheckout = () => {
    if (!validate()) return;
    if (paymentMethod === "ONLINE") {
      paymentRef.current = `TMP-${Date.now()}`;
      setShowQr(true);
      return;
    }
    submitOrder();
  };

  if (cartLoading) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.center}>
          <ActivityIndicator size="large" color="#111" />
        </View>
      </SafeAreaView>
    );
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.center}>
          <Text style={{ fontSize: 48 }}>🛒</Text>
          <Text style={s.emptyTitle}>Giỏ hàng trống</Text>
          <TouchableOpacity
            style={s.emptyBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={s.emptyBtnText}>Tiếp tục mua sắm</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF8" />

      <View style={s.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.headerBack}
          activeOpacity={0.7}
        >
          <Text style={s.headerBackText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Thanh toán</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={s.section}>
            <Text style={s.sectionTitle}>Thông tin nhận hàng</Text>
            <Field
              label="Tên người nhận"
              value={receiverName}
              onChangeText={setReceiverName}
              placeholder="Họ và tên"
            />
            <Field
              label="Số điện thoại"
              value={receiverPhone}
              onChangeText={setReceiverPhone}
              placeholder="0912345678"
              keyboardType="phone-pad"
            />
            <Field
              label="Địa chỉ giao hàng"
              value={shippingAddress}
              onChangeText={setShippingAddress}
              placeholder="Số nhà, đường, phường/xã, quận/huyện..."
            />
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Sản phẩm đặt mua</Text>
            {cartItems.map((item, idx) => (
              <View
                key={`${item.productId}-${idx}`}
                style={[
                  s.productRow,
                  idx < cartItems.length - 1 && s.productRowBorder,
                ]}
              >
                <Image
                  source={{ uri: item.image?.[0] || "" }}
                  style={s.productImg}
                  resizeMode="cover"
                />
                <View style={s.productMeta}>
                  <Text style={s.productName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={s.productQty}>x{item.quantity}</Text>
                </View>
                <Text style={s.productPrice}>
                  {formatCurrency(Number(item.price) * item.quantity)}
                </Text>
              </View>
            ))}
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Phương thức thanh toán</Text>
            {(["COD", "ONLINE"] as const).map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  s.payOption,
                  paymentMethod === method && s.payOptionActive,
                ]}
                onPress={() => setPaymentMethod(method)}
                activeOpacity={0.75}
              >
                <View
                  style={[s.radio, paymentMethod === method && s.radioActive]}
                >
                  {paymentMethod === method && <View style={s.radioDot} />}
                </View>
                <View>
                  <Text
                    style={[
                      s.payLabel,
                      paymentMethod === method && s.payLabelActive,
                    ]}
                  >
                    {method === "COD"
                      ? "Thanh toán khi nhận hàng"
                      : "Chuyển khoản ngân hàng"}
                  </Text>
                  <Text style={s.payDesc}>
                    {method === "COD"
                      ? "Trả tiền khi nhận được hàng"
                      : "Quét QR thanh toán ngay"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Tóm tắt</Text>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Tạm tính</Text>
              <Text style={s.summaryValue}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Phí vận chuyển</Text>
              <Text style={[s.summaryValue, { color: "#10B981" }]}>
                Miễn phí
              </Text>
            </View>
            <View style={s.summaryDivider} />
            <View style={s.summaryRow}>
              <Text
                style={[
                  s.summaryLabel,
                  { fontWeight: "700", color: "#111", fontSize: 15 },
                ]}
              >
                Tổng cộng
              </Text>
              <Text style={s.grandTotal}>{formatCurrency(subtotal)}</Text>
            </View>
          </View>

          {errorMsg ? <Text style={s.errorText}>{errorMsg}</Text> : null}
          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={s.footer}>
        <View>
          <Text style={s.footerLabel}>Tổng</Text>
          <Text style={s.footerAmount}>{formatCurrency(subtotal)}</Text>
        </View>
        <TouchableOpacity
          style={[s.checkoutBtn, isPending && { opacity: 0.6 }]}
          onPress={handleCheckout}
          disabled={isPending}
          activeOpacity={0.85}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={s.checkoutBtnText}>
              {paymentMethod === "ONLINE"
                ? "Đặt hàng & Thanh toán"
                : "Đặt hàng"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <QrModal
        visible={showQr}
        paymentRef={paymentRef.current}
        amount={subtotal}
        onConfirm={() => {
          setShowQr(false);
          submitOrder();
        }}
        onClose={() => {
          setShowQr(false);
          setErrorMsg("Mã QR đã hết hiệu lực, vui lòng thử lại");
        }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FAFAF8" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  emptyBtn: {
    marginTop: 12,
    backgroundColor: "#111",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyBtnText: { color: "#fff", fontWeight: "600" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EFE9",
  },
  headerBack: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBackText: { fontSize: 22, color: "#111" },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#111" },

  scroll: { padding: 16, gap: 12 },

  section: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0EFE9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    marginBottom: 14,
    letterSpacing: 0.2,
  },

  field: { marginBottom: 12 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111",
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  productRowBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  productImg: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
  },
  productMeta: { flex: 1 },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
    lineHeight: 18,
  },
  productQty: { fontSize: 12, color: "#9CA3AF", marginTop: 3 },
  productPrice: { fontSize: 13, fontWeight: "700", color: "#111" },

  payOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  payOptionActive: { borderColor: "#111", backgroundColor: "#FAFAF8" },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: "#111" },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#111" },
  payLabel: { fontSize: 14, fontWeight: "600", color: "#374151" },
  payLabelActive: { color: "#111" },
  payDesc: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryLabel: { fontSize: 14, color: "#6B7280" },
  summaryValue: { fontSize: 14, fontWeight: "600", color: "#111" },
  summaryDivider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 8 },
  grandTotal: { fontSize: 18, fontWeight: "800", color: "#EF4444" },

  errorText: {
    fontSize: 13,
    color: "#EF4444",
    textAlign: "center",
    fontWeight: "500",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0EFE9",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  footerLabel: { fontSize: 12, color: "#9CA3AF" },
  footerAmount: { fontSize: 18, fontWeight: "800", color: "#EF4444" },
  checkoutBtn: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});

const qr = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    alignItems: "center",
  },
  drag: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  title: { fontSize: 17, fontWeight: "700", color: "#111" },
  closeText: { fontSize: 18, color: "#9CA3AF", padding: 4 },
  bankInfo: { alignItems: "center", marginBottom: 16 },
  bankName: { fontSize: 16, fontWeight: "700", color: "#111" },
  bankAccount: { fontSize: 13, color: "#6B7280", marginTop: 3 },
  bankAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#EF4444",
    marginTop: 6,
  },
  qrWrapper: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0EFE9",
    backgroundColor: "#FAFAF8",
    marginBottom: 12,
  },
  qrImg: { width: 200, height: 200 },
  qrNote: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    marginBottom: 16,
  },
  timerTrack: {
    flex: 1,
    height: 5,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
  },
  timerFill: { height: "100%", borderRadius: 3 },
  timerText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    width: 32,
    textAlign: "right",
  },
  confirmBtn: {
    backgroundColor: "#111",
    borderRadius: 14,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 8,
  },
  confirmText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  devNote: { fontSize: 11, color: "#C4C4C4", fontStyle: "italic" },
});
