import React, { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Message, FormData, Step } from './types/ContactTypes';
import ServiceSelect from './ServiceSelect';

interface ChatMessagesProps {
  messages: Message[];
  currentStep: Step;
  formData: FormData;
}

const ChatMessages = ({ messages, currentStep, formData }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages, currentStep]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-6 space-y-4"
    >
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 bg-[#4500F9]/20 rounded-full flex items-center justify-center mr-3">
                <span className="text-[#4500F9] text-sm">S</span>
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                message.sender === 'user'
                  ? 'bg-[#4500F9] text-white'
                  : 'bg-[#1F103B]/30 text-[#CCAFFF]'
              } ${message.sender === 'bot' ? 'rounded-tl-none' : 'rounded-tr-none'}`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-50 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Show service selection when on service step */}
        {currentStep === 'service' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="w-8 h-8 bg-[#4500F9]/20 rounded-full flex items-center justify-center mr-3">
              <span className="text-[#4500F9] text-sm">S</span>
            </div>
            <ServiceSelect 
              value={formData.service}
              onChange={(value) => {
                const input = document.querySelector('input');
                if (input) {
                  input.value = value;
                  input.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;