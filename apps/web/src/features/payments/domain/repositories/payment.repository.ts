import type { CreatePaymentRequest, PaymentTransaction, PaymentVerification } from '../entities/payment.entity';

export interface IPaymentRepository {
  createPayment(request: CreatePaymentRequest): Promise<PaymentTransaction>;
  verifyPayment(transactionId: string): Promise<PaymentVerification>;
  getPaymentStatus(transactionId: string): Promise<PaymentTransaction>;
}
