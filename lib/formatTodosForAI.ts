// const formatTodosForAI = (board: Board) => {
//   const todos = Array.from(board.columns.entries());

//   const flatArray = todos.reduce((map, [key, value]) => {
//     map[key] = value.todos;
//     return map;
//   }, {} as { [key in TypedColumn]: Todo[] });

//   // reduce to key: value(length)
//   const flatArrayCounted = Object.entries(flatArray).reduce(
//     (map, [key, value]) => {
//       map[key as TypedColumn] = value.length;

//       return map;
//     },
//     {} as { [key in TypedColumn]: number }
//   );

//   return flatArrayCounted;
// };

// export default formatTodosForAI;

const formatTodosForAI = (board: Board) => {
  const flatArray: { [key in keyof TypedColumn]: number } = Array.from(
    board.columns.values()
  )
    .flat()
    .reduce((obj, curr) => {
      return { ...obj, [curr.id]: curr.todos.length };
    }, {} as { [key in keyof TypedColumn]: number });

  return flatArray;
};

export default formatTodosForAI;
