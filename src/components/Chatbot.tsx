import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, MinusCircle } from 'lucide-react';

interface Message {
  type: 'user' | 'bot';
  text: string;
}

const commonQuestions = [
  'What is your baggage policy?',
  'How can I cancel my booking?',
  'What are the check-in requirements?',
  'Do you offer refunds?'
];

const botResponses: Record<string, string> = {
  'baggage': 'Our baggage policy allows:\n- Carry-on: 1 bag up to 7kg (15.4 lbs)\n- Checked: 1 bag up to 23kg (50.7 lbs)\nAdditional or overweight baggage fees may apply.',
  'cancel': 'You can cancel your booking up to 24 hours before departure for a full refund. After that, cancellation fees may apply. Visit your booking details page to process a cancellation.',
  'check-in': 'Online check-in opens 24 hours before departure and closes 2 hours before. Please arrive at the airport at least:\n- 2 hours before domestic flights\n- 3 hours before international flights',
  'refund': 'Refunds are available for cancellations made at least 24 hours before departure. Processing time is typically 5-7 business days. Terms and conditions apply.',
  'default': 'I\'m here to help! Please ask about baggage policy, cancellations, check-in requirements, or refunds.'
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInput('');

    // Generate bot response
    setTimeout(() => {
      let botResponse = botResponses.default;
      
      const lowerCase = userMessage.toLowerCase();
      if (lowerCase.includes('baggage') || lowerCase.includes('luggage')) {
        botResponse = botResponses.baggage;
      } else if (lowerCase.includes('cancel')) {
        botResponse = botResponses.cancel;
      } else if (lowerCase.includes('check-in') || lowerCase.includes('checkin')) {
        botResponse = botResponses.checkin;
      } else if (lowerCase.includes('refund')) {
        botResponse = botResponses.refund;
      }

      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 500);
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
    handleSend();
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
    // Reset messages when closing
    setMessages([{ type: 'bot', text: 'Hello! How can I help you today?' }]);
    setInput('');
  };

  return (
    <>
      {!isOpen && !isMinimized && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {isMinimized && (
        <button
          onClick={() => {
            setIsMinimized(false);
            setIsOpen(true);
          }}
          className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 flex items-center space-x-2"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Chat Support</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl z-50 flex flex-col">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Customer Support</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(true);
                }}
                className="hover:text-blue-200"
                aria-label="Minimize chat"
              >
                <MinusCircle className="h-5 w-5" />
              </button>
              <button
                onClick={handleClose}
                className="hover:text-blue-200"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 h-96 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Common questions:</p>
              <div className="flex flex-wrap gap-2">
                {commonQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;