'use client';

import React, { Fragment, useRef } from 'react';
import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { useModalState } from '@/store/ModalStore';
import { useBoardStore } from '@/store/BoardStore';
import TaskTypeRadioGroup from './TaskTypeRadioGroup';
import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/solid';

export function Modal() {
  const imagePickerRef = useRef<HTMLInputElement>(null);

  const [isOpen, close] = useModalState((state) => [
    state.isOpen,
    state.zt_close,
  ]);

  const [image, addTaskInput, addTaskType, setImage, setAddTaskInput, addTask] =
    useBoardStore((state) => [
      state.image,
      state.addTaskInput,
      state.addTaskType,
      state.zt_setImage,
      state.zt_setAddTaskInput,
      state.zt_addTask,
    ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!addTaskInput) return;

    console.log(addTaskInput, addTaskType, image);
    addTask(addTaskInput, addTaskType, image);
    setImage(null);
    setAddTaskInput('');
    close();
  };

  const handleClose = () => {
    close();
    setImage(null);
    setAddTaskInput('');
  };

  return (
    <>
      <Transition as={Fragment} appear show={isOpen}>
        <Dialog
          as="form"
          onSubmit={handleSubmit}
          className="relative z-10 focus:outline-none "
          onClose={handleClose}
        >
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500/30" />
          </TransitionChild>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-lg rounded-xl bg-white/70 p-6 backdrop-blur-2xl">
                  {/* <DialogPanel className="w-full max-w-md rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-500/10 p-6 backdrop-blur-2xl"> */}

                  <DialogTitle
                    as="h3"
                    className="text-base/7 font-medium text-gray-600"
                  >
                    Add a Task
                  </DialogTitle>
                  <p className="mt-2 text-sm/6 text-gray-500">
                    Your payment has been successfully submitted. We’ve sent you
                    an email with all of the details of your order.
                  </p>

                  <div className="mt-2">
                    <input
                      type="text"
                      value={addTaskInput}
                      onChange={(e) => setAddTaskInput(e.target.value)}
                      placeholder="Enter task here..."
                      className="w-full rounded-md border-gray-300 outline-none p-5 shadow-sm focus:border-black focus:ring-black my-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    />
                  </div>

                  <TaskTypeRadioGroup />

                  <div>
                    <button
                      type="button"
                      onClick={() => imagePickerRef.current?.click()}
                      className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                      Upload Image
                    </button>
                    {image && (
                      <Image
                        alt="upload image"
                        className="w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed"
                        width={200}
                        height={200}
                        src={URL.createObjectURL(image)}
                        onClick={() => setImage(null)}
                      />
                    )}
                  </div>

                  <div>
                    <input
                      type="file"
                      ref={imagePickerRef}
                      hidden
                      onChange={(e) => {
                        //check e is an image
                        if (!e.target.files![0].type.startsWith('image/'))
                          return;

                        console.log(e.target.files);
                        setImage(e.target.files![0]);
                      }}
                    />
                  </div>

                  <div className="mt-4">
                    <Button
                      type="submit"
                      disabled={!addTaskInput}
                      className="inline-flex items-center gap-2 rounded-md bg-violet-200 py-2 px-5 text-sm/6 font-semibold text-gray-700 shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-white/70 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                      onClick={close}
                    >
                      Add Task!
                    </Button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default Modal;
