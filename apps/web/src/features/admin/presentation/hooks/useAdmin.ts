import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminRepositoryImpl } from "@/features/admin/data/repositories/admin.repository.impl";
import { createAdminUseCases } from "@/features/admin/domain/use-cases/admin.use-case";
import type {
  AdminUserListQuery,
  AdminStoreListQuery,
  AdminStoreProductQuery,
  AdminStoreOrderQuery,
  AdminStoreWithdrawalQuery,
  AdminProductListQuery,
  RejectSellerDTO,
  RejectWithdrawalDTO,
  UpdateStoreFeeDTO,
  SuspendUserDTO,
  BanUserDTO,
  CreateAdminDTO,
  AdminShipperLeaderboardQuery,
} from "@/features/admin/data/dtos/admin.dto";

const repo = new AdminRepositoryImpl();
const useCases = createAdminUseCases(repo);

const KEYS = {
  dashboard: ["admin", "dashboard"] as const,
  stores: (q?: AdminStoreListQuery) => ["admin", "stores", q] as const,
  storeDetail: (id: number) => ["admin", "stores", id] as const,
  storeProducts: (id: number, q?: AdminStoreProductQuery) =>
    ["admin", "stores", id, "products", q] as const,
  storeOrders: (id: number, q?: AdminStoreOrderQuery) =>
    ["admin", "stores", id, "orders", q] as const,
  storeWithdrawals: (id: number, q?: AdminStoreWithdrawalQuery) =>
    ["admin", "stores", id, "withdrawals", q] as const,
  products: (q?: AdminProductListQuery) => ["admin", "products", q] as const,
  productDetail: (id: number) => ["admin", "products", id] as const,
  users: (q?: AdminUserListQuery) => ["admin", "users", q] as const,
  userDetail: (id: number) => ["admin", "users", id] as const,
  shipperLeaderboard: (q?: AdminShipperLeaderboardQuery) => ["admin", "shippers", "leaderboard", q] as const,
};

export const useAdminDashboard = () =>
  useQuery({
    queryKey: KEYS.dashboard,
    queryFn: () => useCases.getDashboard(),
  });

export const useAdminStores = (query?: AdminStoreListQuery) =>
  useQuery({
    queryKey: KEYS.stores(query),
    queryFn: () => useCases.getStores(query),
  });

export const useAdminStoreDetail = (sellerId: number) =>
  useQuery({
    queryKey: KEYS.storeDetail(sellerId),
    queryFn: () => useCases.getStoreDetail(sellerId),
    enabled: !!sellerId,
  });

export const useAdminStoreProducts = (
  sellerId: number,
  query?: AdminStoreProductQuery,
) =>
  useQuery({
    queryKey: KEYS.storeProducts(sellerId, query),
    queryFn: () => useCases.getStoreProducts(sellerId, query),
    enabled: !!sellerId,
  });

export const useAdminStoreOrders = (
  sellerId: number,
  query?: AdminStoreOrderQuery,
) =>
  useQuery({
    queryKey: KEYS.storeOrders(sellerId, query),
    queryFn: () => useCases.getStoreOrders(sellerId, query),
    enabled: !!sellerId,
  });

export const useAdminStoreWithdrawals = (
  sellerId: number,
  query?: AdminStoreWithdrawalQuery,
) =>
  useQuery({
    queryKey: KEYS.storeWithdrawals(sellerId, query),
    queryFn: () => useCases.getStoreWithdrawals(sellerId, query),
    enabled: !!sellerId,
  });

export const useAdminProducts = (query?: AdminProductListQuery) =>
  useQuery({
    queryKey: KEYS.products(query),
    queryFn: () => useCases.getProducts(query),
  });

export const useAdminProductDetail = (productId: number) =>
  useQuery({
    queryKey: KEYS.productDetail(productId),
    queryFn: () => useCases.getProductDetail(productId),
    enabled: !!productId,
  });

export const useAdminUsers = (query?: AdminUserListQuery) =>
  useQuery({
    queryKey: KEYS.users(query),
    queryFn: () => useCases.getUsers(query),
  });

export const useAdminUserDetail = (userId: number) =>
  useQuery({
    queryKey: KEYS.userDetail(userId),
    queryFn: () => useCases.getUserDetail(userId),
    enabled: !!userId,
  });

export const useApproveSeller = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sellerId: number) => useCases.approveSeller(sellerId),
    onSuccess: (_, sellerId) => {
      qc.invalidateQueries({ queryKey: KEYS.storeDetail(sellerId) });
      qc.invalidateQueries({ queryKey: ["admin", "stores"] });
    },
  });
};

export const useRejectSeller = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sellerId,
      body,
    }: {
      sellerId: number;
      body: RejectSellerDTO;
    }) => useCases.rejectSeller(sellerId, body),
    onSuccess: (_, { sellerId }) => {
      qc.invalidateQueries({ queryKey: KEYS.storeDetail(sellerId) });
      qc.invalidateQueries({ queryKey: ["admin", "stores"] });
    },
  });
};

export const useSuspendSeller = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sellerId: number) => useCases.suspendSeller(sellerId),
    onSuccess: (_, sellerId) => {
      qc.invalidateQueries({ queryKey: KEYS.storeDetail(sellerId) });
      qc.invalidateQueries({ queryKey: ["admin", "stores"] });
    },
  });
};

export const useUpdateStoreFee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sellerId,
      body,
    }: {
      sellerId: number;
      body: UpdateStoreFeeDTO;
    }) => useCases.updateStoreFee(sellerId, body),
    onSuccess: (_, { sellerId }) => {
      qc.invalidateQueries({ queryKey: KEYS.storeDetail(sellerId) });
    },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => useCases.deleteProduct(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["admin", "stores"] });
    },
  });
};

export const useSuspendUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, body }: { userId: number; body: SuspendUserDTO }) =>
      useCases.suspendUser(userId, body),
    onSuccess: (_, { userId }) => {
      qc.invalidateQueries({ queryKey: KEYS.userDetail(userId) });
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

export const useBanUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, body }: { userId: number; body: BanUserDTO }) =>
      useCases.banUser(userId, body),
    onSuccess: (_, { userId }) => {
      qc.invalidateQueries({ queryKey: KEYS.userDetail(userId) });
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => useCases.deleteUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

export const useApproveWithdrawal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (withdrawalId: number) =>
      useCases.approveWithdrawal(withdrawalId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "stores"] });
    },
  });
};

export const useRejectWithdrawal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      withdrawalId,
      body,
    }: {
      withdrawalId: number;
      body: RejectWithdrawalDTO;
    }) => useCases.rejectWithdrawal(withdrawalId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "stores"] });
    },
  });
};

export const useCreateAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, body }: { userId: number; body: CreateAdminDTO }) =>
      useCases.createAdmin(userId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

export const useAdminShipperLeaderboard = (
  query?: AdminShipperLeaderboardQuery,
) =>
  useQuery({
    queryKey: KEYS.shipperLeaderboard(query),
    queryFn: () => useCases.getShipperLeaderboard(query),
  });