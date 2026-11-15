import React, { useState, useRef, useEffect } from 'react';
import { AgeMode, Language } from '../types/game';
import { getTranslation } from '../services/localization';
import { novaService, NovaChatContext } from '../services/novaService';
import { sound } from '../services/sound';
import { Cpu, HelpCircle, Loader2, Send, X } from 'lucide-react';

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
    const welcomeText =
      lang === 'en'
        ? `Hello ${cadetName}. NOVA Technical Assistant is online — which spacecraft subsystem, power budget, or repair strategy would you like to discuss?`
        : `Xin chào ${cadetName}. Hệ thống trợ lý kỹ thuật NOVA đã sẵn sàng — bạn muốn trao đổi về thiết bị, thông số điện hay phương án sửa chữa nào?`;

    setMessages((prev) => {
      if (prev.length === 0) {
        return [
          {
            id: 'welcome_1',
            sender: 'nova',
            text: welcomeText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      }
      return prev.map((m) => (m.id === 'welcome_1' ? { ...m, text: welcomeText } : m));
    });
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
      const response = await novaService.askNova(text, lang, context);
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
          text:
            lang === 'en'
              ? 'Technical assistant connection was interrupted. Please resend your question.'
              : 'Kết nối trợ lý kỹ thuật tạm gián đoạn. Bạn vui lòng gửi lại câu hỏi.',
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
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3.5 py-2.5 rounded-xl shadow-lg transition-colors cursor-pointer border border-slate-700"
        aria-label={lang === 'en' ? 'Ask NOVA Technical Assistant' : 'Hỏi Trợ lý Kỹ thuật NOVA'}
      >
        <img
          src="/src/assets/images/academy_telemetry_emblem_1794626910467.jpg"
          alt={lang === 'en' ? 'NOVA Technical Assistant' : 'Trợ lý Kỹ thuật NOVA'}
          referrerPolicy="no-referrer"
          className="w-8 h-8 rounded-lg object-cover border border-sky-500/50"
        />
        <span className="text-sm hidden sm:inline">
          {lang === 'en' ? 'Ask NOVA' : 'Hỏi NOVA'}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-3 sm:p-6 bg-slate-950/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl flex flex-col max-h-[85vh] sm:max-h-[600px] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/academy_telemetry_emblem_1794626910467.jpg"
              alt="NOVA"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-lg object-cover border border-sky-500/60"
            />
            <div>
              <div className="text-sm font-bold text-white">NOVA</div>
              <p className="text-xs text-sky-300 font-medium">
                {lang === 'en' ? 'Technical Assistant' : 'Trợ lý Kỹ thuật'}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label={lang === 'en' ? 'Close' : 'Đóng'}
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'cadet' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'nova' && (
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.sender === 'cadet'
                    ? 'bg-sky-600 text-white rounded-br-none font-medium'
                    : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                }`}
              >
                <p>{m.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sky-700 text-xs font-semibold py-2 px-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.novaThinking}</span>
            </div>
          )}
        </div>

        <div className="px-3 py-2 bg-white border-t border-slate-200 flex flex-wrap items-center gap-1.5 text-xs">
          <HelpCircle className="w-4 h-4 text-sky-600 shrink-0" />
          {t.quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-sky-50 text-slate-800 font-medium border border-slate-200 transition-colors text-left cursor-pointer disabled:opacity-50"
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
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.askNovaPlaceholder}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
