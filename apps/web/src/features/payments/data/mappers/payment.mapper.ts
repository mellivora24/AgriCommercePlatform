import type { PaymentTransaction, PaymentVerification } from '../../domain/entities/payment.entity';
import type { PaymentTransactionDTO, PaymentVerificationDTO } from '../api/payments.api';

export const PaymentMapper = {
  toTransactionEntity: (dto: PaymentTransactionDTO): PaymentTransaction => dto,
  toVerificationEntity: (dto: PaymentVerificationDTO): PaymentVerification => dto,
};
