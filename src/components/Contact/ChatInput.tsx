import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { Step } from './types/ContactTypes';

interface ChatInputProps {
  currentStep: Step;
  onSubmit: (value: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ currentStep, onSubmit, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSubmit(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (currentStep === 'complete') return null;

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-white/5">
      <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Schreiben Sie hier..."
          className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 text-sm px-2"
          disabled={isLoading}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className={`p-2 rounded-lg ${
            isLoading || !message.trim() 
              ? 'bg-[#4500F9]/50 cursor-not-allowed' 
              : 'bg-[#4500F9] hover:bg-[#4500F9]/90'
          } text-white transition-colors`}
        >
          <Send className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;