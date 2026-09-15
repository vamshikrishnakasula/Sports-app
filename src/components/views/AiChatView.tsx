import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  ShieldAlert,
  Loader2,
  Heart,
  Smile,
  Compass,
} from 'lucide-react';
import { ChatMessage, MoodType } from '../../types';
import { api } from '../../services/api';

interface AiChatViewProps {
  latestMood?: MoodType;
  onNavigateToOverthinking: () => void;
  onOpenCrisis: () => void;
}

export const AiChatView: React.FC<AiChatViewProps> = ({
  latestMood,
  onNavigateToOverthinking,
  onOpenCrisis,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    "I can't stop overthinking a recent conversation",
    'I feel anxious and need help calming down',
    'I feel exhausted and burnt out from everything',
    'Help me reframe a harsh critical thought about myself',
  ];

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadChatHistory = async () => {
    try {
      const history = await api.getChatHistory();
      setMessages(history);
    } catch (err) {
      console.error('Failed to load chat:', err);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText('');
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const response = await api.sendMessage(text, latestMood);
      setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), tempUserMsg, response]);
    } catch (err) {
      console.error('Failed to send message:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: "I'm having a brief connection pause, but I am right here with you. Take a deep, gentle breath and try sending your thought again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Start a fresh conversation with MindEase? Your previous notes and practices will still be safely saved.')) {
      setIsResetting(true);
      try {
        await api.resetChat();
        await loadChatHistory();
      } catch (err) {
        console.error('Reset chat error:', err);
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)] min-h-[550px] bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Top Bar */}
      <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 font-serif">MindEase Companion</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                Online • Powered by Gemini AI
              </span>
            </div>
            <p className="text-xs text-stone-500">
              {latestMood ? (
                <span className="flex items-center gap-1">
                  <Smile className="w-3 h-3 text-emerald-600" />
                  Context: Logged as <strong className="capitalize">{latestMood}</strong>
                </span>
              ) : (
                'Empathetic, confidential mental health listening space'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="reset-chat-btn"
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
            title="Start fresh conversation"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-stone-50/30">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Heart className="w-4 h-4 fill-white/20 stroke-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-stone-900 text-white rounded-tr-xs'
                    : msg.isCrisisAlert
                    ? 'bg-rose-50 border border-rose-200 text-rose-950 rounded-tl-xs'
                    : 'bg-white border border-stone-200 text-stone-800 rounded-tl-xs'
                }`}
              >
                {/* Message Body */}
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Overthinking Shortcut if relevant */}
                {msg.text.toLowerCase().includes('overthinking') && !isUser && (
                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500">Need to unpick racing thoughts?</span>
                    <button
                      onClick={onNavigateToOverthinking}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Open Overthinking SOS</span>
                    </button>
                  </div>
                )}

                {/* Crisis Button if alert */}
                {msg.isCrisisAlert && (
                  <div className="mt-3 pt-3 border-t border-rose-200 flex items-center gap-2">
                    <button
                      onClick={onOpenCrisis}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>View Emergency Crisis Helplines</span>
                    </button>
                  </div>
                )}

                {/* Suggestions / Prompt Chips below assistant reply */}
                {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-stone-100">
                    <p className="text-[11px] font-medium text-stone-400 mb-1.5">Gentle suggestions:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 transition-colors text-left"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] mt-2 ${
                    isUser ? 'text-stone-400 text-right' : 'text-stone-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-stone-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs p-4 shadow-xs flex items-center gap-2 text-xs text-stone-500">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>MindEase is thinking gently...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts (if chat is short) */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-6 py-2 bg-stone-50 border-t border-stone-100">
          <p className="text-xs text-stone-500 mb-2 flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Not sure where to begin? Try one of these:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {starterPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-xs bg-white border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 text-stone-700 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="chat-input-field"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Share what's on your mind... (e.g. 'I made a mistake today and feel terrible')"
            disabled={isLoading}
            className="flex-1 bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-stone-900 border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-2xl px-4 py-3 text-sm transition-all outline-none"
          />
          <button
            id="chat-submit-btn"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-11 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white flex items-center justify-center transition-colors shadow-xs shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[11px] text-stone-400 text-center mt-2">
          MindEase provides empathetic guidance & grounding techniques. For medical emergencies, please use Crisis Lifelines.
        </p>
      </div>
    </div>
  );
};
