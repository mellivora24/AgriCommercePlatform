import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys";
import { DeliveryUseCase } from "@/features/delivery/domain/use-case/delivery.use-case";
import { DeliveryRepositoryImpl } from "@/features/delivery/data/repositories/delivery.repository.impl";
import type {
  ShipmentEntity,
  ShipmentTab,
  ShipperAllowedStatus,
} from "@/features/delivery/domain/entities/delivery.entity";

const useCase = new DeliveryUseCase(new DeliveryRepositoryImpl());

export function useDelivery() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<ShipmentTab>("pending");
  const [page, setPage] = useState(1);
  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentEntity | null>(null);

  const shipmentsQuery = useQuery({
    queryKey: QUERY_KEYS.SHIPPER_SHIPMENTS_LIST(page, tab),
    queryFn: () => useCase.getShipments(tab, page),
  });

  const acceptMutation = useMutation({
    mutationFn: (id: number) => useCase.acceptShipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SHIPPER_SHIPMENTS });
      setSelectedShipment(null);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: ShipperAllowedStatus;
    }) => useCase.updateShipmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SHIPPER_SHIPMENTS });
      setSelectedShipment(null);
    },
  });

  const handleTabChange = (newTab: ShipmentTab) => {
    setTab(newTab);
    setPage(1);
  };

  return {
    tab,
    page,
    setPage,
    handleTabChange,
    selectedShipment,
    setSelectedShipment,
    shipmentsQuery,
    acceptMutation,
    updateStatusMutation,
  };
}
