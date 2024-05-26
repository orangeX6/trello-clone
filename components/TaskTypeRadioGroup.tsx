'use client';

import React from 'react';
import { Field, Label, Radio, RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useBoardStore } from '@/store/BoardStore';

const types = [
  {
    id: 'todo',
    name: 'Todo',
    description: 'A new task to be completed',
    color: 'bg-red-500/70',
  },
  {
    id: 'inprogress',
    name: 'In Progress',
    description: 'A task that is currently being worked on',
    color: 'bg-yellow-500',
  },
  {
    id: 'done',
    name: 'Done',
    description: 'A task that has been completed',
    color: 'bg-green-500/70',
  },
];

const TaskTypeRadioGroup = () => {
  const [selectedTaskType, setSelectedTaskType] = useBoardStore((state) => [
    state.addTaskType,
    state.zt_setAddTaskType,
  ]);

  return (
    <div className="w-full py-5">
      <div className="mx-auto w-full max-w-lg">
        <RadioGroup
          value={selectedTaskType}
          onChange={setSelectedTaskType}
          aria-label="Task Type"
          className="space-y-2"
        >
          {types.map((type) => (
            <Radio
              key={type.id}
              value={type.id}
              className={({ checked }) =>
                `group relative flex cursor-pointer rounded-lg py-4 px-5 text-white shadow-md transition focus:outline-none ${
                  checked
                    ? `ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-green-300 ${type.color} `
                    : 'bg-white/5'
                }`
              }
            >
              {({ checked }) => (
                <div className="flex w-full items-center justify-between">
                  <div className="text-sm/6">
                    <Label
                      as="p"
                      className={`font-semibold ${
                        checked ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {type.name}
                    </Label>
                    <div
                      className={`flex gap-2 ${
                        checked ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      <div>{type.name}</div>
                      <div aria-hidden="true">&middot;</div>
                      <div>{type.description}</div>
                    </div>
                  </div>
                  {checked && (
                    <CheckCircleIcon className="w-5 h-5 text-white opacity-100 transition" />
                  )}
                </div>
              )}
            </Radio>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default TaskTypeRadioGroup;
