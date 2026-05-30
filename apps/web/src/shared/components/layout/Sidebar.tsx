import React from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ClipboardList,
  ShieldCheck,
  Store,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/core/store";
import { ROUTES } from "@/core/router/routes";
import { useCartStore } from "@/core/store";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const { clearCart } = useCartStore();
  const { clearAuth } = useAuthStore();

  const sellerLinks: NavLink[] = [
    {
      label: "Dashboard",
      path: ROUTES.SELLER_DASHBOARD,
      icon: <LayoutDashboard className="h-4.5 w-4.5" />,
    },
    {
      label: "Sản phẩm",
      path: ROUTES.SELLER_PRODUCTS,
      icon: <Package className="h-4.5 w-4.5" />,
    },
    {
      label: "Đơn hàng",
      path: ROUTES.SELLER_ORDERS,
      icon: <ShoppingBag className="h-4.5 w-4.5" />,
    },
    {
      label: "Cửa hàng",
      path: ROUTES.SELLER_STORE ?? "#",
      icon: <Store className="h-4.5 w-4.5" />,
    },
  ];

  const adminLinks: NavLink[] = [
    {
      label: "Dashboard",
      path: ROUTES.ADMIN_DASHBOARD,
      icon: <LayoutDashboard className="h-4.5 w-4.5" />,
    },
    {
      label: "Người dùng",
      path: ROUTES.ADMIN_USERS,
      icon: <Users className="h-4.5 w-4.5" />,
    },
    {
      label: "Sản phẩm",
      path: ROUTES.ADMIN_PRODUCTS,
      icon: <Package className="h-4.5 w-4.5" />,
    },
    {
      label: "Đơn hàng",
      path: ROUTES.ADMIN_ORDERS,
      icon: <ClipboardList className="h-4.5 w-4.5" />,
    },
    {
      label: "Kiểm duyệt",
      path: ROUTES.ADMIN_MODERATION ?? "#",
      icon: <ShieldCheck className="h-4.5 w-4.5" />,
    },
  ];

  const handleLogout = () => {
    clearCart();
    clearAuth();
  };

  const isSeller = user?.role === "SELLER";
  const links = isSeller ? sellerLinks : adminLinks;

  const roleLabel = isSeller ? "Người bán" : "Quản trị viên";
  const roleBadgeClass = isSeller
    ? "bg-emerald-500/20 text-emerald-300"
    : "bg-blue-500/20 text-blue-300";

  return (
    <aside
      className={classNames(
        "relative flex h-screen flex-col bg-gray-900 text-white transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-[72px]",
      )}
    >
      {/* ── User info ── */}
      <div
        className={classNames(
          "flex flex-shrink-0 items-center border-b border-white/[0.06] py-4",
          isOpen ? "gap-3 px-4" : "justify-center px-0",
        )}
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-sm font-bold text-white ring-2 ring-white/10">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          {/* Online dot */}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-gray-900 bg-green-400" />
        </div>

        {/* Name + email + role badge */}
        {isOpen && (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name ?? "—"}
              </p>
              <span
                className={classNames(
                  "flex-shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
                  roleBadgeClass,
                )}
              >
                {roleLabel}
              </span>
            </div>
            <p className="truncate text-xs text-gray-400">{user?.email ?? "—"}</p>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3">
        {/* Section label */}
        {isOpen && (
          <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            {isSeller ? "Quản lý bán hàng" : "Quản trị hệ thống"}
          </p>
        )}

        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              title={!isOpen ? link.label : undefined}
              className={classNames(
                "group flex items-center rounded-lg transition-all duration-150",
                isOpen ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5",
                isActive
                  ? "bg-green-500/15 text-green-400"
                  : "text-gray-400 hover:bg-white/[0.06] hover:text-white",
              )}
            >
              {/* Icon */}
              <span
                className={classNames(
                  "flex-shrink-0 transition-colors",
                  isActive ? "text-green-400" : "text-gray-500 group-hover:text-white",
                )}
              >
                {link.icon}
              </span>

              {/* Label */}
              {isOpen && (
                <span className="text-sm font-medium leading-none">
                  {link.label}
                </span>
              )}

              {/* Active indicator bar */}
              {isActive && isOpen && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-green-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      <div className="flex-shrink-0 border-t border-white/[0.06] px-2 py-3">
        <button
          onClick={handleLogout}
          title={!isOpen ? "Đăng xuất" : undefined}
          className={classNames(
            "group flex w-full items-center rounded-lg text-gray-400 transition-all duration-150 hover:bg-red-500/10 hover:text-red-400",
            isOpen ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5",
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {isOpen && (
            <span className="text-sm font-medium">Đăng xuất</span>
          )}
        </button>
      </div>
    </aside>
  );
};
