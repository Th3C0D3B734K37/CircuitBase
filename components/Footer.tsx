'use client';

import React from 'react';
import { useAppContext } from './AppContext';

export default function Footer() {
  const { theme } = useAppContext();

  return (
    <footer className={`border-t ${theme === 'dark' ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Main Footer Links */}
        <div className="flex flex-wrap justify-center items-center gap-2 text-sm mb-6">
          <a
            href="https://github.com/Th3C0D3B734K37/CircuitBase"
            target="_blank"
            rel="noreferrer"
            className={`hover:text-amber-500 transition-colors ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            View Source
          </a>
          <span className={theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}>/</span>
          <a
            href="https://github.com/Th3C0D3B734K37/CircuitBase/blob/main/docs/API.md"
            target="_blank"
            rel="noreferrer"
            className={`hover:text-amber-500 transition-colors ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            API Documentation
          </a>
          <span className={theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}>/</span>
          <a
            href="https://github.com/Th3C0D3B734K37/CircuitBase/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noreferrer"
            className={`hover:text-amber-500 transition-colors ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            Contribute
          </a>
          <span className={theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}>/</span>
          <a
            href="https://github.com/Th3C0D3B734K37/CircuitBase/issues"
            target="_blank"
            rel="noreferrer"
            className={`hover:text-amber-500 transition-colors ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            Report Issue
          </a>
        </div>

        {/* Copyright */}
        <div className={`text-center text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
          <span>© 2024 CircuitBase</span>
          <span className="mx-2">•</span>
          <span>Built for electronics enthusiasts</span>
        </div>
      </div>
    </footer>
  );
}

