import { PlusCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import TodoCard from './TodoCard';
import { useBoardStore } from '@/store/BoardStore';
import { useModalState } from '@/store/ModalStore';

type ColumnProps = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: { [key in TypedColumn]: string } = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

const Column = ({ id, todos, index }: ColumnProps) => {
  const [search, setAddTaskType] = useBoardStore((state) => [
    state.search,
    state.zt_setAddTaskType,
  ]);
  const open = useModalState((state) => state.zt_open);

  const handleAddTodo = () => {
    setAddTaskType(id);
    open();
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {/* render droppable todos in the column */}
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? 'bg-sky-200/50' : 'bg-white/50'
                }`}
              >
                <h2 className="flex justify-between font-bold text-xl p-2">
                  {idToColumnText[id]}
                  <span className="text-gray-500 bg-gray-200 rounded-full px-2 py-2 text-sm font-normal">
                    {!search
                      ? todos.length
                      : todos.filter((todo) =>
                          todo.title
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        ).length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {todos.map((todo, index) => {
                    if (todo.title.toLowerCase().includes(search.toLowerCase()))
                      return (
                        <Draggable
                          key={todo.$id}
                          draggableId={todo.$id}
                          index={index}
                        >
                          {(provided) => (
                            <TodoCard
                              todo={todo}
                              index={index}
                              id={id}
                              innerRef={provided.innerRef}
                              draggableProps={provided.draggableProps}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          )}
                        </Draggable>
                      );
                  })}

                  {provided.placeholder}

                  <div className="flex items-end justify-end p-2">
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={handleAddTodo}
                    >
                      <PlusCircleIcon className="h-10 w-10 text-green-600/300" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
