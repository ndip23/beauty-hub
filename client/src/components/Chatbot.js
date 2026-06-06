// Chatbot.js
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { faqs, responses } from "../data/chatbotResponses";

const Chatbot = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! 👋 How can I assist your salon today?" },
  ]);
  const [input, setInput] = useState("");
  const [faqVisible, setFaqVisible] = useState(true);
  const [typing, setTyping] = useState(false);
  const chatRef = useRef();
  const lang = i18n.language.startsWith("fr") ? "fr" : "en";

  const getResponse = (text) => {
    const userMsg = text.toLowerCase();
    let bestMatch = null;
    let highestScore = 0;

    for (const rule of responses[lang]) {
      let score = 0;
      rule.keywords.forEach((kw) => {
        if (userMsg.includes(kw)) score++;
      });
      if (score > highestScore) {
        highestScore = score;
        bestMatch = rule;
      }
    }

    if (bestMatch) {
      const randomIndex = Math.floor(Math.random() * bestMatch.answers.length);
      return bestMatch.answers[randomIndex];
    }

    return lang === "fr"
      ? "Je ne suis pas sûr de comprendre 🤔 Reformulez ou choisissez un sujet ci-dessous 👇"
      : "I'm not sure I got that 🤔 Try rephrasing or select a topic below 👇";
  };

  const sendMessage = async (text, fromFAQ = false) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setFaqVisible(false);

    setTyping(true);
    await new Promise((res) => setTimeout(res, 800));

    const botReply = getResponse(text);
    setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    setTyping(false);
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages, typing]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.1 }}
          className="w-72 sm:w-80 md:w-96 h-[70vh] md:h-[520px] bg-white rounded-2xl shadow-xl border flex flex-col overflow-hidden fixed bottom-20 right-5 z-50"
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-primary-pink to-primary-purple text-white px-4 py-3 flex justify-between items-center">
            <h2 className="font-semibold text-lg">
              {lang === "fr" ? "Support Beautyhub" : "Beautyhub Support"}
            </h2>
            <button onClick={onClose}>
              <X size={22} />
            </button>
          </div>

          {/* MESSAGES */}
          <div
            ref={chatRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 max-w-[75%] text-sm rounded-2xl shadow ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-primary-pink to-primary-purple text-white rounded-br-sm"
                      : "bg-white text-gray-800 border rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-1 items-center text-gray-500 text-sm ml-2 animate-pulse">
                <span>Typing</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-150">.</span>
                <span className="animate-bounce delay-300">.</span>
              </div>
            )}

            {faqVisible && (
              <div className="flex flex-wrap gap-2 mt-2">
                {faqs[lang].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q, true)}
                    className="bg-white text-primary-purple text-xs px-3 py-2 rounded-full border hover:bg-purple-100 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="p-3 border-t">
            <div className="flex gap-2 items-center bg-white rounded-xl p-2 shadow-sm">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder={
                  lang === "fr" ? "Écrivez ici..." : "Type a message..."
                }
                className="flex-1 px-2 py-1 outline-none text-sm min-w-0"
              />
              <button
                onClick={() => sendMessage(input)}
                className="shrink-0 bg-gradient-to-r from-primary-pink to-primary-purple text-white p-2 rounded-lg"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Chatbot;
