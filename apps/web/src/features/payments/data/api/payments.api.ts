import type { AxiosInstance } from 'axios';
import type { CreatePaymentRequest, PaymentTransaction, PaymentVerification } from '../../domain/entities/payment.entity';

export type PaymentTransactionDTO = PaymentTransaction;
export type PaymentVerificationDTO = PaymentVerification;
export type CreatePaymentRequestDTO = CreatePaymentRequest;

export const createPaymentsApi = (axiosInstance: AxiosInstance) => ({
  // Get payment by ID
  getPayment: async (paymentId: number): Promise<PaymentTransactionDTO> => {
    const { data } = await axiosInstance.get(`/payments/${paymentId}`);
    return data;
  },

  // Get payment by order ID
  getOrderPayment: async (orderId: number): Promise<PaymentTransactionDTO> => {
    const { data } = await axiosInstance.get(`/payments/order/${orderId}`);
    return data;
  },

  // Confirm payment
  confirmPayment: async (paymentId: number, dto: any): Promise<PaymentTransactionDTO> => {
    const { data } = await axiosInstance.put(`/payments/${paymentId}/confirm`, dto);
    return data;
  },

  // List payments for an order
  getPaymentsByOrder: async (orderId: number): Promise<PaymentTransactionDTO[]> => {
    const { data } = await axiosInstance.get(`/payments/order/${orderId}/list`);
    return data;
  },

  // Refund payment
  refundPayment: async (paymentId: number): Promise<PaymentTransactionDTO> => {
    const { data } = await axiosInstance.put(`/payments/${paymentId}/refund`);
    return data;
  },

  // Get pending payments
  getPendingPayments: async (): Promise<PaymentTransactionDTO[]> => {
    const { data } = await axiosInstance.get('/payments/pending/all');
    return data;
  },

  // Get COD confirmations
  getCODConfirmations: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/payments/cod/confirmation');
    return data;
  },
});

export type PaymentsApi = ReturnType<typeof createPaymentsApi>;
