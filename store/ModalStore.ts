import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  zt_open: () => void;
  zt_close: () => void;
}

export const useModalState = create<ModalState>((set) => ({
  isOpen: false,
  zt_open: () => set({ isOpen: true }),
  zt_close: () => set({ isOpen: false }),
}));
