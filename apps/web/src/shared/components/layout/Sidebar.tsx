import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useAuthStore } from '../../../core/store';
import { ROUTES } from '../../../core/router/routes';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const user = useAuthStore((state) => state.user);

  const sellerLinks = [
    { label: 'Dashboard', path: ROUTES.SELLER_DASHBOARD },
    { label: 'Products', path: ROUTES.SELLER_PRODUCTS },
    { label: 'Orders', path: ROUTES.SELLER_ORDERS },
    { label: 'Analytics', path: ROUTES.SELLER_ANALYTICS },
  ];

  const adminLinks = [
    { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
    { label: 'Users', path: ROUTES.ADMIN_USERS },
    { label: 'Products', path: ROUTES.ADMIN_PRODUCTS },
    { label: 'Orders', path: ROUTES.ADMIN_ORDERS },
  ];

  const links =
    user?.role === 'seller' ? sellerLinks : adminLinks;

  return (
    <aside
      className={classNames(
        'bg-gray-900 text-white h-screen transition-all',
        isOpen ? 'w-64' : 'w-20',
      )}
    >
      <div className="p-4">
        <div className="text-2xl font-bold">
          {isOpen ? 'TMDT' : 'T'}
        </div>
      </div>
      <nav className="mt-8">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="block px-4 py-3 hover:bg-gray-800 transition-colors"
          >
            {isOpen ? link.label : link.label.charAt(0)}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
