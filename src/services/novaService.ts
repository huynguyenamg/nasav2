import { AgeMode, Language } from '../types/game';

export interface NovaChatContext {
  ageMode: AgeMode;
  missionId: string;
  stage: string;
  cadetName: string;
  telemetry?: {
    battery?: number;
    mass?: number;
    solarPower?: number;
    budget?: number;
    commsSignal?: number;
    anomaly?: string;
  };
  diagnosticStep?: number;
}

export const novaService = {
  async askNova(
    message: string,
    lang: Language,
    context: NovaChatContext
  ): Promise<{ reply: string; source: string }> {
    try {
      const res = await fetch('/api/nova/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, lang, context }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return { reply: data.reply, source: data.source || 'gemini-3.8-flash' };
    } catch (err) {
      console.warn('NOVA service client fallback:', err);
      const isVi = lang === 'vi';
      return {
        reply: isVi
          ? `Chào ${context.cadetName}. Hệ thống trợ lý đang kết nối lại — bạn hãy kiểm tra cân bằng năng lượng và ngân sách thiết bị trước khi vận hành.`
          : `Hello ${context.cadetName}. Please verify your power balance and budget limits before operation.`,
        source: 'nova-local-guardian',
      };
    }
  },
};
