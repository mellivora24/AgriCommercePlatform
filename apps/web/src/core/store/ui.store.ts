import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface Modal {
  id: string;
  title: string;
  content: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface UIState {
  toasts: Toast[];
  modals: Modal[];
  sidebarOpen: boolean;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  addModal: (modal: Omit<Modal, 'id'>) => void;
  removeModal: (id: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  modals: [],
  sidebarOpen: false,

  addToast: (toast) =>
    set((state) => {
      const id = Math.random().toString(36).slice(2, 9);
      const newToast = { ...toast, id };
      return { toasts: [...state.toasts, newToast] };
    }),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  addModal: (modal) =>
    set((state) => {
      const id = Math.random().toString(36).slice(2, 9);
      const newModal = { ...modal, id };
      return { modals: [...state.modals, newModal] };
    }),

  removeModal: (id) =>
    set((state) => ({
      modals: state.modals.filter((m) => m.id !== id),
    })),

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
