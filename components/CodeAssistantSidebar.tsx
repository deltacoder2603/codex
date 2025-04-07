"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiCpu } from 'react-icons/fi';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Add useEffect for click outside handling
interface CodeAssistantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Change to named export
export function CodeAssistantSidebar({ isOpen, onClose }: CodeAssistantSidebarProps) {
  const [input, setInput] = useState('');
  // Remove unused state
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `As an expert programmer, provide clear and concise code with explanations for:\n\n${input}\n\nPlease format your response with code blocks using triple backticks with language name, like: (your code here) \`\`\``;
      const result = await model.generateContent(prompt);
      const response = await result.response;

      setMessages(prev => [...prev, { text: response.text(), sender: 'bot' }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: 'Error: ' + (error as Error).message, sender: 'bot' }]);
    }

    setInput('');
    setIsLoading(false);
  };

  // Function to format bot messages with code highlighting
  // Fix TypeScript any types
  const formatBotMessage = (message: string) => {
    try {
      const parts = message.split(/```(\w+)?\n/);
      
      return (
        <div className="prose prose-invert max-w-none">
          {parts.map((part, index) => {
            if (part === undefined || part === null) {
              return null;
            }
            
            if (index % 3 === 1) {
              return null;
            }
            else if (index % 3 === 2) {
              const language = parts[index - 1] || 'javascript';
              const codeContent = part.replace(/```$/, '');
              
              return (
                <div key={index} className="my-4 relative group">
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    showLineNumbers={true}
                    className="rounded-lg !bg-[#1a1a1a] !p-4"
                  >
                    {codeContent}
                  </SyntaxHighlighter>
                  <button
                    onClick={() => navigator.clipboard.writeText(codeContent)}
                    className="absolute bottom-3 right-3 bg-[#252525] text-gray-400 hover:text-white px-3 py-1.5 rounded-lg text-sm flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>Copy code</span>
                  </button>
                </div>
              );
            }
            // If this is regular text
            else {
              // Process text paragraph by paragraph
              const paragraphs = part.split('\n\n').filter(p => p.trim());
              
              if (paragraphs.length > 1) {
                return paragraphs.map((paragraph, pIndex) => (
                  <p key={`${index}-${pIndex}`} className="mb-4">
                    {processInlineCode(paragraph)}
                  </p>
                ));
              }
              
              return <span key={index}>{processInlineCode(part)}</span>;
            }
          })}
        </div>
      );
    } catch {
      // Remove unused error parameter
      return <div className="whitespace-pre-wrap">{message}</div>;
    }
  };

  // Helper function to process inline code
  const processInlineCode = (text: string) => {
    // Safety check
    if (!text) return null;
    
    const parts = text.split(/`([^`]+)`/);
    return parts.map((part, i) => 
      i % 2 === 0 ? (
        <span key={i}>{part}</span>
      ) : (
        <code key={i} className="bg-[#2d2d2d] px-1 py-0.5 rounded font-mono text-sm">
          {part}
        </code>
      )
    );
  };

  // Remove this duplicate declaration
  // const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          ref={sidebarRef}
          initial={{ x: 350 }}
          animate={{ x: 0 }}
          exit={{ x: 350 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 h-full w-[400px] bg-[#1a1a1a] shadow-2xl z-40 flex flex-col border-l border-[#333]"
        >
          <div className="p-6 border-b border-[#333] bg-[#1a1a1a] flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-500/10 p-2 rounded-lg mr-3">
                <FiCpu className="text-blue-400" size={22} />
              </div>
              <h2 className="text-xl font-semibold text-white font-mono">CodeX Assistant</h2>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-[#333] p-2 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <FiX size={20} className="text-gray-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#1a1a1a] scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
            {messages.map((msg, i) => (
              <div key={i} className={`rounded-lg ${
                msg.sender === 'user' 
                  ? 'bg-blue-500/10 text-white ml-auto max-w-[90%] p-4' 
                  : 'bg-[#252525] text-gray-200 max-w-[90%] p-4'
              }`}>
                {msg.sender === 'bot' ? (
                  formatBotMessage(msg.text)
                ) : (
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {msg.text}
                  </pre>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="p-4 rounded-lg bg-[#252525] text-gray-200">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-200"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-400"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-6 border-t border-[#333] bg-[#1a1a1a]">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about code..."
                className="w-full p-4 bg-[#252525] text-gray-200 border border-[#333] rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none font-mono text-sm"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleSubmit(e as any);
                  }
                }}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-3 bottom-3 bg-blue-500 text-white p-2.5 rounded-lg hover:bg-blue-600 disabled:bg-blue-500/50 transition-colors"
              >
                <FiSend size={18} />
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-right">
              Press Ctrl+Enter to send
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
