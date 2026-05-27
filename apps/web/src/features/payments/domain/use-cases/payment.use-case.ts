import type { CreatePaymentRequest, PaymentTransaction, PaymentVerification } from '../entities/payment.entity';
import type { IPaymentRepository } from '../repositories/payment.repository';

export interface CreatePaymentUseCase {
  execute(request: CreatePaymentRequest): Promise<PaymentTransaction>;
}

export interface VerifyPaymentUseCase {
  execute(transactionId: string): Promise<PaymentVerification>;
}

export interface GetPaymentStatusUseCase {
  execute(transactionId: string): Promise<PaymentTransaction>;
}

export const createCreatePaymentUseCase = (repository: IPaymentRepository): CreatePaymentUseCase => ({
  execute: (request) => repository.createPayment(request),
});

export const createVerifyPaymentUseCase = (repository: IPaymentRepository): VerifyPaymentUseCase => ({
  execute: (transactionId) => repository.verifyPayment(transactionId),
});

export const createGetPaymentStatusUseCase = (repository: IPaymentRepository): GetPaymentStatusUseCase => ({
  execute: (transactionId) => repository.getPaymentStatus(transactionId),
});
