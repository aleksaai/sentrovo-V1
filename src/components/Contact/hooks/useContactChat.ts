import { useState, useCallback } from 'react';
import { Message, FormData, Step } from '../types/ContactTypes';
import { getNextStep, getStepMessage, validateInput } from '../utils/chatFlow';

export const useContactChat = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    content: 'Willkommen bei Sentrovo! Wie dürfen wir Sie nennen?',
    sender: 'bot',
    timestamp: Date.now()
  }]);
  
  const [currentStep, setCurrentStep] = useState<Step>('name');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const submitFormData = async (data: FormData) => {
    try {
      const response = await fetch('https://hook.eu2.make.com/12jl1evymufm1wt2q9gjogyz4onfthdq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      return true;
    } catch (error) {
      console.error('Error submitting form:', error);
      return false;
    }
  };

  const handleInput = useCallback(async (value: string) => {
    if (!value.trim()) return;

    // For service selection, immediately show the selection
    if (currentStep === 'service') {
      setFormData(prev => ({ ...prev, service: value }));
      
      // Add user message with selected service
      const userMessage: Message = {
        id: Date.now().toString(),
        content: value,
        sender: 'user',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, userMessage]);

      // Move to next step after a short delay
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const nextStep = getNextStep(currentStep);
      if (nextStep) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: getStepMessage(nextStep),
          sender: 'bot',
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, botMessage]);
        setCurrentStep(nextStep);
      }
      setIsLoading(false);
      return;
    }

    // Regular text input handling
    const userMessage: Message = {
      id: Date.now().toString(),
      content: value,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Validate input
    const validationError = validateInput(currentStep, value);
    if (validationError) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: validationError,
        sender: 'bot',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
      return;
    }

    // Update form data
    const updatedFormData = { ...formData, [currentStep]: value };
    setFormData(updatedFormData);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Move to next step
    const nextStep = getNextStep(currentStep);
    if (nextStep) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getStepMessage(nextStep),
        sender: 'bot',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMessage]);
      setCurrentStep(nextStep);
    } else if (currentStep === 'message') {
      // Form is complete, submit data
      setIsLoading(true);
      const success = await submitFormData(updatedFormData);
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: success 
          ? 'Vielen Dank für Ihre Nachricht! Wir werden uns schnellstmöglich bei Ihnen melden.'
          : 'Entschuldigung, es gab einen Fehler bei der Übermittlung. Bitte versuchen Sie es später erneut.',
        sender: 'bot',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, responseMessage]);
      setCurrentStep('complete');
    }
    
    setIsLoading(false);
  }, [currentStep, formData]);

  return {
    messages,
    currentStep,
    formData,
    handleInput,
    isLoading
  };
};