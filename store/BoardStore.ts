import { create } from 'zustand';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';

interface BoardState {
  board: Board;
  zt_getBoard: () => void;
  zt_setBoard: (board: Board) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  zt_getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
  zt_setBoard: (board: Board) => set({ board }),
}));
