import { xid } from "zod";

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  X: "/",
  HOME_PAGE: "/products",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/[id]",

  BUYER_HOME: "/(buyer)",
  BUYER_CART: "/(buyer)/cart",
  BUYER_ORDERS: "/(buyer)/orders",
  BUYER_PROFILE: "/(buyer)/profile",

  CART: "/cart",
  CHECKOUT: "/checkout",
  CHECKOUT_PAYMENT: "/checkout/payment",
  CHECKOUT_CONFIRM: "/checkout/confirm",

  ORDERS: "/orders",
  ORDER_DETAIL: "/orders/[id]",
  ORDER_TRACKING: "/orders/[id]/tracking",

  PROFILE: "/profile",
  PROFILE_SETTINGS: "/profile/settings",
  PROFILE_ADDRESSES: "/profile/addresses",
  PROFILE_WISHLIST: "/profile/wishlist",

  WALLET: "/wallet",
  WALLET_TOPUP: "/wallet/topup",
  WALLET_TRANSACTIONS: "/wallet/transactions",

  SHIPMENTS: "/shipments",
  SHIPMENT_DETAIL: "/shipments/[id]",

  RETURNS: "/returns",
  RETURN_DETAIL: "/returns/[id]",
  RETURN_CREATE: "/returns/[orderId]/create",

  SELLER_PENDING: "/seller-pending",
  SELLER: "/seller",
  SELLER_DASHBOARD: "/seller/dashboard",
  SELLER_PRODUCTS: "/seller/products",
  SELLER_PRODUCT_CREATE: "/seller/products/create",
  SELLER_PRODUCT_EDIT: "/seller/products/[id]/edit",
  SELLER_ORDERS: "/seller/orders",
  SELLER_ORDER_DETAIL: "/seller/orders/[id]",
  SELLER_ANALYTICS: "/seller/analytics",
  SELLER_SETTINGS: "/seller/settings",
  SELLER_STORE: "/seller/store",

  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_STORES: "/admin/stores",
  ADMIN_SELLERS: "/admin/sellers",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_SETTINGS: "/admin/settings",
  ADMIN_MODERATION: "/admin/moderation",

  SHIPPER_DASHBOARD: "/shipper/dashboard",
} as const;
