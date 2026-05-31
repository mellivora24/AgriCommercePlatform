import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/core/network/axios.instance';
import { createShipmentsApi } from '../../data/api/shipments.api';
import { createShipmentRepository } from '../../data/repositories/shipment.repository.impl';
import { createListShipmentsUseCase, createGetShipmentUseCase } from '../../domain/use-cases/shipment.use-case';
import { QUERY_KEYS } from '@/core/constants/query-keys';

const shipmentsApi = createShipmentsApi(axiosInstance);
const shipmentRepository = createShipmentRepository(shipmentsApi);

export const useListShipments = (page: number = 1, limit: number = 10) => {
  const useCase = createListShipmentsUseCase(shipmentRepository);
  return useQuery({
    queryKey: QUERY_KEYS.SHIPMENTS_LIST(page),
    queryFn: () => useCase.execute(page, limit),
  });
};

export const useGetShipment = (shipmentId: string) => {
  const useCase = createGetShipmentUseCase(shipmentRepository);
  return useQuery({
    queryKey: QUERY_KEYS.SHIPMENTS_DETAIL(shipmentId),
    queryFn: () => useCase.execute(shipmentId),
    enabled: !!shipmentId,
  });
};
