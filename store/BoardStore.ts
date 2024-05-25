import { create } from 'zustand';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import { databases, storage } from '@/appwrite';

interface BoardState {
  board: Board;
  zt_getBoard: () => void;
  zt_setBoard: (board: Board) => void;
  zt_updateTasksInDB: (todo: Todo, columnId: string) => void;
  search: string;
  zt_setSearch: (search: string) => void;
  zt_deleteTask: (taskIndex: number, todo: Todo, columnId: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  search: '',
  zt_getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
  zt_setBoard: (board: Board) => set({ board }),
  zt_updateTasksInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
        ...(todo.image && { image: JSON.stringify(todo.image) }),
      }
    );
  },
  zt_deleteTask: async (taskIndex, todo, columnId) => {
    const columns = new Map(get().board.columns);

    console.log(columns, 'ID', columnId, 'TODOS', columns.get(columnId)?.todos);
    // delete todoId from column
    columns.get(columnId)?.todos.splice(taskIndex, 1);

    set({ board: { columns } });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

  zt_setSearch: (search) => set({ search }),
}));
