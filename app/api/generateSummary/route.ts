import { genAIModel } from '@/googleAi';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // todos in the body of the POST Request
  const { todos } = await request.json();

  const chat = genAIModel.startChat({
    history: [
      {
        role: 'user',
        parts: [
          {
            text: `I have a list of tasks i have to either complete, are in progress, or have been completed. I want you to generate a summary of the tasks. Here's the data ${JSON.stringify(
              todos
            )}`,
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: `Hi there, Orange here! Welcome to the Trello task list, where tasks don't just get done—they get a standing ovation. 🎉 Let's conquer those todos together!`,
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

  const msg = `Hi there, provide a summary of the following todos. Count how many todos are in each category such as To do, in progress and done, then tell the user to have a productive day! Here's the data ${JSON.stringify(
    todos
  )}`;

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();

  return NextResponse.json({ text });
}
