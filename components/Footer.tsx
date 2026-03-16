'use client';

import React from 'react';
import { useAppContext } from './AppContext';
import { Github, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  const { theme } = useAppContext();

  return (
    <footer className={`border-t ${theme === 'dark' ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          
          {/* About Section */}
          <div>
            <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
              About CircuitBase
            </h3>
            <p className={`mb-2 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
              A comprehensive electronics component database and management system designed for hobbyists, engineers, and professionals.
            </p>
            <div className="space-y-2">
              <a 
                href="https://github.com/Th3C0D3B734K37/CircuitBase" 
                target="_blank" 
                rel="noreferrer"
                className={`flex items-center gap-2 hover:text-amber-500 transition-colors ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}
              >
                <Github size={16} />
                <span>View Source</span>
              </a>
            </div>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
              Resources
            </h3>
            <div className="space-y-2">
              <a 
                href="https://github.com/Th3C0D3B734K37/CircuitBase/blob/main/docs/API.md" 
                target="_blank" 
                rel="noreferrer"
                className={`flex items-center gap-2 hover:text-amber-500 transition-colors ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}
              >
                <ExternalLink size={16} />
                <span>API Documentation</span>
              </a>
              <a 
                href="https://github.com/Th3C0D3B734K37/CircuitBase/blob/main/CONTRIBUTING.md" 
                target="_blank" 
                rel="noreferrer"
                className={`flex items-center gap-2 hover:text-amber-500 transition-colors ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}
              >
                <Heart size={16} />
                <span>Contribute</span>
              </a>
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
              Project Stats
            </h3>
            <div className="space-y-1 text-xs">
              <div className={`flex justify-between ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                <span>Components:</span>
                <span className="font-mono">185+</span>
              </div>
              <div className={`flex justify-between ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                <span>Categories:</span>
                <span className="font-mono">13</span>
              </div>
              <div className={`flex justify-between ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                <span>Tools:</span>
                <span className="font-mono">13</span>
              </div>
              <div className={`flex justify-between ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                <span>Projects:</span>
                <span className="font-mono">5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className={`border-t ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'} my-8`}></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center py-4 text-xs">
          <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>
            <span>© 2024 CircuitBase</span>
            <span>•</span>
            <span>Built with</span>
            <Heart className="w-3 h-3 text-red-500 mx-1" />
            <span>for electronics enthusiasts</span>
          </div>
          
          <div className={`flex items-center gap-4 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>
            <a 
              href="https://github.com/Th3C0D3B734K37/CircuitBase" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-amber-500 transition-colors"
            >
              <Github size={14} />
            </a>
            <a 
              href="https://github.com/Th3C0D3B734K37/CircuitBase/issues" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-amber-500 transition-colors"
            >
              Report Issue
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
