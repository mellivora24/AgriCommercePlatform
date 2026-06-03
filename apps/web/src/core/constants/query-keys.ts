export const QUERY_KEYS = {
  AUTH: ["auth"] as const,
  AUTH_ME: ["auth", "me"] as const,

  PRODUCTS: ["products"] as const,
  PRODUCTS_LIST: (page: number, limit: number, categoryId?: number) =>
    ["products", "list", { page, limit, categoryId }] as const,
  PRODUCTS_DETAIL: (id: number | string) => ["products", "detail", id] as const,
  PRODUCTS_SEARCH: (query: string, page: number, limit: number) =>
    ["products", "search", { query, page, limit }] as const,
  PRODUCTS_SIMILAR: (name: string, limit: number) =>
    ["products", "similar", { name, limit }] as const,

  CART: ["cart"] as const,
  CART_ITEMS: ["cart", "items"] as const,

  ORDERS: ["orders"] as const,
  ORDERS_LIST: ["orders", "list"] as const,
  ORDERS_DETAIL: (id: number | string) => ["orders", "detail", id] as const,

  PAYMENTS: ["payments"] as const,

  WALLET: ["wallet"] as const,
  WALLET_BALANCE: ["wallet", "balance"] as const,
  WALLET_TRANSACTIONS: (page: number) =>
    ["wallet", "transactions", { page }] as const,

  SHIPMENTS: ["shipments"] as const,
  SHIPMENTS_LIST: (page: number) => ["shipments", "list", { page }] as const,
  SHIPMENTS_DETAIL: (id: number | string) =>
    ["shipments", "detail", id] as const,

  RETURNS: ["returns"] as const,
  RETURNS_LIST: (page: number) => ["returns", "list", { page }] as const,

  SELLERS: ["sellers"] as const,
  SELLERS_PRODUCTS: (sellerId: number | string) =>
    ["sellers", "products", sellerId] as const,
  SELLERS_ANALYTICS: ["sellers", "analytics"] as const,

  SELLER_DASHBOARD: ["seller", "dashboard"] as const,
  SELLER_PRODUCTS: (filter: Record<string, unknown>) =>
    ["seller", "products", filter] as const,
  SELLER_ORDERS: (filter: Record<string, unknown>) =>
    ["seller", "orders", filter] as const,
  SELLER_ORDERS_LIST: ["seller", "orders", "list"] as const,
  SELLER_ORDER_STATS: ["seller", "orders", "stats"] as const,
  SELLER_SETTINGS: ["seller", "settings"] as const,

  BUYER_PROFILE: ["buyer", "profile"] as const,
  BUYER_ADDRESSES: ["buyer", "addresses"] as const,

  ADMIN_USERS: (page: number) => ["admin", "users", { page }] as const,
  ADMIN_PRODUCTS: (page: number) => ["admin", "products", { page }] as const,
  ADMIN_ORDERS: (page: number) => ["admin", "orders", { page }] as const,

  SHIPPER_SHIPMENTS: ["shipper", "shipments"] as const,
  SHIPPER_SHIPMENTS_LIST: (page: number, tab: string) =>
    ["shipper", "shipments", "list", { page, tab }] as const,
  SHIPPER_SHIPMENT_DETAIL: (id: number | string) =>
    ["shipper", "shipments", "detail", id] as const,
} as const;
