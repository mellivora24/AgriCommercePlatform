export const QUERY_KEYS = {
  // Auth
  AUTH: ["auth"],
  AUTH_ME: ["auth", "me"],

  // Products
  PRODUCTS: ["products"],
  PRODUCTS_LIST: (page: number, limit: number, categoryId?: number) => [
    "products",
    page,
    limit,
    categoryId,
  ],
  PRODUCTS_DETAIL: (id: string) => ["products", "detail", id],
  PRODUCTS_SEARCH: (query: string) => ["products", "search", query],

  // Cart
  CART: ["cart"],
  CART_ITEMS: ["cart", "items"],

  // Orders
  ORDERS: ["orders"],
  ORDERS_LIST: (page: number, limit: number) => ["orders", "list", page, limit],
  ORDERS_DETAIL: (id: string) => ["orders", "detail", id],

  // Payments
  PAYMENTS: ["payments"],

  // Wallet
  WALLET: ["wallet"],
  WALLET_BALANCE: ["wallet", "balance"],
  WALLET_TRANSACTIONS: (page: number) => ["wallet", "transactions", page],

  // Shipments
  SHIPMENTS: ["shipments"],
  SHIPMENTS_LIST: (page: number) => ["shipments", "list", page],
  SHIPMENTS_DETAIL: (id: string) => ["shipments", "detail", id],

  // Returns
  RETURNS: ["returns"],
  RETURNS_LIST: (page: number) => ["returns", "list", page],

  // Sellers
  SELLERS: ["sellers"],
  SELLERS_PRODUCTS: (sellerId: string) => ["sellers", "products", sellerId],
  SELLERS_ANALYTICS: ["sellers", "analytics"],

  // Buyer Profile
  BUYER_PROFILE: ["buyer", "profile"],
  BUYER_ADDRESSES: ["buyer", "addresses"],

  // Admin
  ADMIN_USERS: (page: number) => ["admin", "users", page],
  ADMIN_PRODUCTS: (page: number) => ["admin", "products", page],
  ADMIN_ORDERS: (page: number) => ["admin", "orders", page],
} as const;
