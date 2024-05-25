'use client';

import { useBoardStore } from '@/store/BoardStore';
import { useEffect } from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import { todo } from 'node:test';
import { start } from 'repl';

const Board = () => {
  const [board, getBoard, setBoard, updateTodoInDB] = useBoardStore((state) => [
    state.board,
    state.zt_getBoard,
    state.zt_setBoard,
    state.zt_updateTasksInDB,
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // Check if user dragged card outside of board
    if (!destination) return;

    //Handle Column drag
    if (type === 'column') {
      const entries = Array.from(board.columns.entries());

      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);

      const rearrangedColumns = new Map(entries);

      setBoard({ ...board, columns: rearrangedColumns });
    } else if (type === 'card') {
      // Handle card drag.
      // This step is needed as the indexes are stored as numbers 0,1,2 etc. instead of id's with DND library
      const columns = Array.from(board.columns);

      const startColIndex = columns[Number(source.droppableId)];
      const finishColIndex = columns[Number(destination.droppableId)];

      const startCol: Column = {
        id: startColIndex[0],
        todos: startColIndex[1].todos,
      };

      const finishCol: Column = {
        id: finishColIndex[0],
        todos: finishColIndex[1].todos,
      };

      if (!startCol || !finishCol) return;

      if (source.index === destination.index && startCol === finishCol) return;

      const newTodos = startCol.todos;
      const [todoToMove] = newTodos.splice(source.index, 1);

      if (startCol.id === finishCol.id) {
        newTodos.splice(destination.index, 0, todoToMove);

        const newColumns = new Map(board.columns);
        newColumns.set(startCol.id, startCol);

        setBoard({ ...board, columns: newColumns });
      } else {
        finishCol.todos.splice(destination.index, 0, {
          ...todoToMove,
          status: finishCol.id,
        });

        const newColumns = new Map(board.columns);

        newColumns.set(startCol.id, startCol);
        newColumns.set(finishCol.id, finishCol);

        updateTodoInDB(todoToMove, finishCol.id);

        setBoard({ ...board, columns: newColumns });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
