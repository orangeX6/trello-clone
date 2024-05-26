import { create } from 'zustand';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import { ID, databases, storage } from '@/appwrite';
import uploadImage from '@/lib/uploadImage';

interface BoardState {
  board: Board;
  zt_getBoard: () => void;
  zt_setBoard: (board: Board) => void;
  zt_updateTasksInDB: (todo: Todo, columnId: string) => void;
  zt_addTask: (
    todo: string,
    columnId: TypedColumn,
    image?: File | null
  ) => void;
  zt_deleteTask: (taskIndex: number, todo: Todo, columnId: TypedColumn) => void;

  addTaskInput: string;
  zt_setAddTaskInput: (input: string) => void;
  addTaskType: TypedColumn;
  zt_setAddTaskType: (column: TypedColumn) => void;
  image: File | null;
  zt_setImage: (image: File | null) => void;

  search: string;
  zt_setSearch: (search: string) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  addTaskInput: '',
  addTaskType: 'todo',
  image: null,
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

  zt_addTask: async (todo, columnId, image) => {
    let file: Image | undefined;

    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ addTaskInput: '' });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },
  zt_deleteTask: async (taskIndex, todo, columnId) => {
    const columns = new Map(get().board.columns);

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

  zt_setAddTaskInput: (input) => set({ addTaskInput: input }),
  zt_setAddTaskType: (column: TypedColumn) => set({ addTaskType: column }),
  zt_setImage: (image: File | null) => set({ image }),
  zt_setSearch: (search) => set({ search }),
}));
