import formatTodosForAI from './formatTodosForAI';

const fetchSuggestion = async (board: Board) => {
  const todos = formatTodosForAI(board);

  const res = await fetch('api/generateSummary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ todos }),
  });

  const data = await res.json();

  const { text } = data;

  return text;
};

export default fetchSuggestion;
