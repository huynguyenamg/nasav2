import React, { useState, useRef, useEffect } from 'react';
import { AgeMode, Language } from '../types/game';
import { getTranslation } from '../services/localization';
import { novaService, NovaChatContext } from '../services/novaService';
import { sound } from '../services/sound';
import { X, Send, Bot, HelpCircle, Loader2 } from 'lucide-react';

interface NovaChatModalProps {
  lang: Language;
  cadetName: string;
  ageMode: AgeMode;
  currentMissionId: string;
  currentStage: string;
  isOpen: boolean;
  onClose: () => void;
  telemetryContext?: Record<string, unknown>;
}

interface ChatMessage {
  id: string;
  sender: 'nova' | 'cadet';
  text: string;
  timestamp: string;
}

export const NovaChatModal: React.FC<NovaChatModalProps> = ({
  lang,
  cadetName,
  ageMode,
  currentMissionId,
  currentStage,
  isOpen,
  onClose,
  telemetryContext,
}) => {
  const t = getTranslation(lang);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome_1',
          sender: 'nova',
          text: `Chào ${cadetName}! Tớ là rô-bốt NOVA. Bé muốn hỏi gì về sao Hỏa hay tàu vũ trụ nào?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [lang, cadetName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    sound.playClick();
    const userMsg: ChatMessage = {
      id: `cadet_${Date.now()}`,
      sender: 'cadet',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const context: NovaChatContext = {
      ageMode,
      missionId: currentMissionId,
      stage: currentStage,
      cadetName,
      telemetry: telemetryContext as NovaChatContext['telemetry'],
    };

    try {
      const response = await novaService.askNova(text, 'vi', context);
      sound.playEquip();
      setMessages((prev) => [
        ...prev,
        {
          id: `nova_${Date.now()}`,
          sender: 'nova',
          text: response.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `nova_err_${Date.now()}`,
          sender: 'nova',
          text: 'NOVA đang nghe lại sóng, bé thử hỏi lại nhé!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          sound.playClick();
          onClose();
        }}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-4 py-2.5 rounded-2xl shadow-lg shadow-sky-200 hover:scale-105 transition-all cursor-pointer border-2 border-white"
        aria-label="Hỏi bạn rô-bốt NOVA"
      >
        <img
          src="/src/assets/images/nova_robot_mascot_1794503042941.jpg"
          alt="Rô-bốt NOVA"
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-xl object-cover border-2 border-white"
        />
        <span className="text-sm hidden sm:inline">Hỏi NOVA</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-3 sm:p-6 bg-sky-950/35 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border-2 border-sky-200 rounded-3xl shadow-xl flex flex-col max-h-[85vh] sm:max-h-[600px] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-sky-50 border-b border-sky-200">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/nova_robot_mascot_1794503042941.jpg"
              alt="NOVA"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover border-2 border-sky-300"
            />
            <div>
              <div className="text-base font-extrabold text-sky-950 font-display">NOVA</div>
              <p className="text-xs font-bold text-sky-700">Bạn rô-bốt hướng dẫn</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-sky-700 hover:text-sky-950 rounded-xl hover:bg-sky-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-sky-50/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'cadet' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'nova' && (
                <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm font-semibold leading-relaxed shadow-sm ${
                  m.sender === 'cadet'
                    ? 'bg-sky-500 text-white rounded-br-none'
                    : 'bg-white text-sky-950 border border-sky-200 rounded-tl-none'
                }`}
              >
                <p>{m.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sky-600 text-xs font-bold py-2 px-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.novaThinking}</span>
            </div>
          )}
        </div>

        <div className="px-3 py-2 bg-white border-t border-sky-100 flex items-center gap-1.5 overflow-x-auto text-xs whitespace-nowrap">
          <HelpCircle className="w-4 h-4 text-sky-500 shrink-0" />
          {t.quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold border border-sky-200 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-sky-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.askNovaPlaceholder}
            className="flex-1 bg-sky-50 border-2 border-sky-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-sky-950 placeholder-sky-400 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
