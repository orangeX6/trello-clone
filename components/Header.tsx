'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Trello from '@/public/Trello.png';
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import Avatar from 'react-avatar';
import { useBoardStore } from '@/store/BoardStore';
import fetchSuggestion from '@/lib/fetchSuggestion';

const Header = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>('');

  const [setSearch, board] = useBoardStore((state) => [
    state.zt_setSearch,
    state.board,
  ]);

  // Debouncer
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, setSearch]);

  useEffect(() => {
    if (board.columns.size === 0) return;

    setLoading(true);

    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
      setLoading(false);
    };

    fetchSuggestionFunc();
  }, [board]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Helper function to render text with newlines
  const renderWithNewlines = (text: string) => {
    return text.split('\n').map((line, index) => <p key={index}>{line}</p>);
  };

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div
          className="absolute 
          top-0
          left-0
          w-full
          h-96
          bg-gradient-to-br
          from-pink-400
          to-[#0a62da]
          rounded-md
          filter
          blur-3xl
          opacity-70
          -z-50
        "
        />

        <Image
          src={Trello}
          alt="Trello"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />
        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          {/* Search Box */}
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2"
              onChange={handleChange}
              value={inputValue}
            />
            <button hidden type="submit">
              Search
            </button>
          </form>

          {/* Avatar */}
          <Avatar name="Pranav Orange" round size="50" color="#0a62da" />
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <div className="flex items-center text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0a62da] p-5">
          <UserCircleIcon
            className={`inline-block h-10 w-10 text-[#0a62da] mr-1 ${
              loading && 'animate-spin'
            }`}
          />
          <div>
            {suggestion && !loading
              ? renderWithNewlines(suggestion)
              : 'Gemini is summarizing your tasks for the day...'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
