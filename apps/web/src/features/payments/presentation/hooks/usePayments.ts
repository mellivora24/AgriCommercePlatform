import { useMutation, useQuery } from '@tanstack/react-query';
import type { CreatePaymentRequest } from '../../domain/entities/payment.entity';
import { axiosInstance } from '@/core/network/axios.instance';
import { createPaymentsApi } from '../../data/api/payments.api';
import { createPaymentRepository } from '../../data/repositories/payment.repository.impl';
import {
  createCreatePaymentUseCase,
  createVerifyPaymentUseCase,
  createGetPaymentStatusUseCase,
} from '../../domain/use-cases/payment.use-case';

const paymentsApi = createPaymentsApi(axiosInstance);
const paymentRepository = createPaymentRepository(paymentsApi);

export const useCreatePayment = () => {
  const useCase = createCreatePaymentUseCase(paymentRepository);
  return useMutation({
    mutationFn: (request: CreatePaymentRequest) => useCase.execute(request),
  });
};

export const useVerifyPayment = (transactionId: string) => {
  const useCase = createVerifyPaymentUseCase(paymentRepository);
  return useQuery({
    queryKey: ['payment', 'verify', transactionId],
    queryFn: () => useCase.execute(transactionId),
    enabled: !!transactionId,
  });
};

export const useGetPaymentStatus = (transactionId: string) => {
  const useCase = createGetPaymentStatusUseCase(paymentRepository);
  return useQuery({
    queryKey: ['payment', 'status', transactionId],
    queryFn: () => useCase.execute(transactionId),
    enabled: !!transactionId,
  });
};
