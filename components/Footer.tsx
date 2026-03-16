'use client';

import React from 'react';
import { useAppContext } from './AppContext';
import { Linkedin, Mail, Github } from 'lucide-react';

export default function Footer() {
  const { theme } = useAppContext();

  return (
    <footer className={`border-t ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'} py-6`}>
      <div className="max-w-5xl mx-auto px-4 flex flex-row items-center justify-between gap-4">
        <div className={`flex items-center gap-3 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {/* <a
           href="mailto:contact@circuitbase.dev"
             className="hover:text-amber-500 transition-colors"
            aria-label="Email"
          >
            <Mail className="h-4 w-4" />
          </a> */}
          <a
            href="https://linkedin.com/in/gayathra-bhatt"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-500 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/Th3C0D3B734K37/CircuitBase"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-500 transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>

        <div className={`text-xs font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'} hover:text-amber-500 transition-colors cursor-default`}>
          ॐ नमो भगवते वासुदेवाय
        </div>

        <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>musashi</p>
      </div>
    </footer>
  );
}

