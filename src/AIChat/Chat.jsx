import React, { useState, useRef, useEffect } from "react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const chatEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    // Add user message
    const userMessage = { text: inputValue, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // First check for simple keywords
    const keywordResponse = generateKeywordResponse(inputValue);
    if (keywordResponse) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: keywordResponse, sender: "bot" },
        ]);
        setIsLoading(false);
      }, 500);
      return;
    }

    // If no keyword match and API hasn't failed, try DeepSeek API
    if (!apiError) {
      try {
        const response = await fetch(
          "https://api.deepseek.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer sk-05ecdee0cb9b4cf59188a7b74a329977`,
            },
            body: JSON.stringify({
              model: "deepseek-chat",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a helpful assistant. Respond concisely and helpfully.",
                },
                ...messages.map((msg) => ({
                  role: msg.sender === "user" ? "user" : "assistant",
                  content: msg.text,
                })),
                {
                  role: "user",
                  content: inputValue,
                },
              ],
              temperature: 0.7,
              max_tokens: 150,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const botResponse =
          data.choices?.[0]?.message?.content ||
          "I couldn't process that request.";

        setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
      } catch (error) {
        console.error("API Error:", error);
        setApiError(true);
        setMessages((prev) => [
          ...prev,
          {
            text: "I'm having trouble connecting to the AI service. I'll use simpler responses for now.",
            sender: "bot",
          },
        ]);
        // Try with local response
        const localResponse = generateLocalResponse(inputValue);
        setMessages((prev) => [
          ...prev,
          { text: localResponse, sender: "bot" },
        ]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // If API has previously failed, use local responses
      const localResponse = generateLocalResponse(inputValue);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: localResponse, sender: "bot" },
        ]);
        setIsLoading(false);
      }, 500);
    }
  };

  const generateKeywordResponse = (userInput) => {
    const input = userInput.toLowerCase();

    // Basic greetings
    if (/hello|hi|hey/.test(input)) {
      return "Hi there! How can I assist you today?";
    }
    // Goodbyes
    else if (/bye|goodbye|see you/.test(input)) {
      return "Goodbye! Feel free to come back if you have more questions.";
    }
    // Thanks
    else if (/thanks|thank you|appreciate/.test(input)) {
      return "You're welcome! Is there anything else I can help with?";
    }
    return null;
  };

  const generateLocalResponse = (userInput) => {
    const input = userInput.toLowerCase();

    // Extended local responses when API fails
    if (/help|support/.test(input)) {
      return "For support, please contact our team at support@example.com or call (123) 456-7890.";
    } else if (/service|offer/.test(input)) {
      return "We offer various services including consulting, development, and design solutions.";
    } else if (/price|cost|fee/.test(input)) {
      return "Our pricing depends on the specific requirements. Could you provide more details?";
    } else if (/contact|email|phone/.test(input)) {
      return "You can reach us at contact@example.com or call (123) 456-7890 during business hours.";
    } else if (/hours|time|open/.test(input)) {
      return "Our business hours are Monday to Friday, 9 AM to 5 PM.";
    } else {
      return "I'm limited in my responses right now. Could you try asking in a different way?";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>AI Assistant</h3>
            <button className="minimize-btn" onClick={toggleChat}>
              −
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button onClick={handleSendMessage} disabled={isLoading}>
              {isLoading ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 38 38"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      x1="8.042%"
                      y1="0%"
                      x2="65.682%"
                      y2="23.865%"
                      id="a"
                    >
                      <stop stopColor="#4f46e5" stopOpacity="0" offset="0%" />
                      <stop
                        stopColor="#4f46e5"
                        stopOpacity=".631"
                        offset="63.146%"
                      />
                      <stop stopColor="#4f46e5" offset="100%" />
                    </linearGradient>
                  </defs>
                  <g fill="none" fillRule="evenodd">
                    <g transform="translate(1 1)">
                      <path
                        d="M36 18c0-9.94-8.06-18-18-18"
                        id="Oval-2"
                        stroke="url(#a)"
                        strokeWidth="2"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="0 18 18"
                          to="360 18 18"
                          dur="0.9s"
                          repeatCount="indefinite"
                        />
                      </path>
                      <circle fill="#fff" cx="36" cy="18" r="1">
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="0 18 18"
                          to="360 18 18"
                          dur="0.9s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  </g>
                </svg>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      ) : (
        <button className="chatbot-toggle" onClick={toggleChat}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}

      <style jsx>{`
        .chatbot-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }

        .chatbot-toggle {
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .chatbot-toggle:hover {
          background-color: #4338ca;
          transform: scale(1.05);
        }

        .chatbot-window {
          width: 350px;
          height: 500px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chatbot-header {
          background-color: #4f46e5;
          color: white;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chatbot-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .minimize-btn {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 0 8px;
          line-height: 1;
        }

        .chatbot-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background-color: #f9fafb;
        }

        .message {
          margin-bottom: 12px;
          padding: 10px 14px;
          border-radius: 18px;
          max-width: 80%;
          word-wrap: break-word;
          line-height: 1.4;
          font-size: 14px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          background-color: #4f46e5;
          color: white;
          margin-left: auto;
          border-bottom-right-radius: 4px;
        }

        .message.bot {
          background-color: #ffffff;
          color: #1f2937;
          margin-right: auto;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .typing-indicator {
          display: flex;
          padding: 8px 0;
        }

        .typing-indicator span {
          height: 8px;
          width: 8px;
          background-color: #9ca3af;
          border-radius: 50%;
          display: inline-block;
          margin: 0 2px;
          animation: bounce 1.5s infinite ease-in-out;
        }

        @keyframes bounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-5px);
          }
        }

        .chatbot-input {
          display: flex;
          padding: 12px;
          border-top: 1px solid #e5e7eb;
          background-color: white;
        }

        .chatbot-input input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          outline: none;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .chatbot-input input:focus {
          border-color: #4f46e5;
        }

        .chatbot-input button {
          margin-left: 8px;
          padding: 0 16px;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s;
          min-width: 60px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-input button:hover:not(:disabled) {
          background-color: #4338ca;
        }

        .chatbot-input button:disabled {
          background-color: #a5b4fc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
