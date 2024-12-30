import React from 'react';
import { motion } from 'framer-motion';

interface ServiceSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const services = [
  'KI Chatbot',
  'Voice Agents',
  'Multi Agenten',
  'Consulting',
  'Karriere',
  'Anderes'
];

const ServiceSelect = ({ value, onChange }: ServiceSelectProps) => {
  const handleServiceSelect = (service: string) => {
    onChange(service);
    // Find the chat input and simulate Enter key press
    const chatInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (chatInput) {
      chatInput.value = service;
      chatInput.dispatchEvent(new Event('change', { bubbles: true }));
      chatInput.form?.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 max-w-[85%]">
      {services.map((service) => (
        <motion.button
          key={service}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleServiceSelect(service)}
          className={`p-3 rounded-xl text-sm text-left transition-all ${
            value === service
              ? 'bg-[#4500F9] text-white'
              : 'bg-[#1F103B]/30 text-white/90 hover:bg-[#1F103B]/40'
          }`}
        >
          {service}
        </motion.button>
      ))}
    </div>
  );
};

export default ServiceSelect;