import type { CreatePaymentRequest, PaymentTransaction, PaymentVerification } from '../../domain/entities/payment.entity';
import type { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { PaymentMapper } from '../mappers/payment.mapper';
import type { PaymentsApi } from '../api/payments.api';

export const createPaymentRepository = (paymentsApi: PaymentsApi): IPaymentRepository => ({
  createPayment: async (request: CreatePaymentRequest): Promise<PaymentTransaction> => {
    const dto = await paymentsApi.createPayment(request);
    return PaymentMapper.toTransactionEntity(dto);
  },

  verifyPayment: async (transactionId: string): Promise<PaymentVerification> => {
    const dto = await paymentsApi.verifyPayment(transactionId);
    return PaymentMapper.toVerificationEntity(dto);
  },

  getPaymentStatus: async (transactionId: string): Promise<PaymentTransaction> => {
    const dto = await paymentsApi.getPaymentStatus(transactionId);
    return PaymentMapper.toTransactionEntity(dto);
  },
});
