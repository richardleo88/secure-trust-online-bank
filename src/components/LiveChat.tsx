
import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! How can I help you with your banking needs today?',
      time: new Date().toLocaleTimeString()
    }
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        type: 'user' as const,
        content: message,
        time: new Date().toLocaleTimeString()
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          type: 'bot' as const,
          content: 'Thank you for your message. A customer service representative will assist you shortly.',
          time: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 banking-gradient rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="banking-gradient text-white p-4 rounded-t-2xl">
            <h3 className="font-semibold">UnionTrust Support</h3>
            <p className="text-sm text-blue-100">We're here to help</p>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-banking-navy text-white'
                      : 'bg-gray-100 text-banking-slate'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                className="banking-gradient text-white"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChat;
