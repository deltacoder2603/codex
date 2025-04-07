"use client";

import { FiCode } from 'react-icons/fi';
import { useState } from 'react';
// Change the import to match the export from CodeAssistantSidebar
import { CodeAssistantSidebar } from './CodeAssistantSidebar';

export default function CodingAssistantButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-blue-600 text-white m-4 p-3 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-lg"
      >
        <FiCode size={18} />
        <span>Coding Assistant</span>
      </button>
      
      <CodeAssistantSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}