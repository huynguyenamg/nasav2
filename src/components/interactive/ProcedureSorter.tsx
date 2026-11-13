import React, { useState } from 'react';
import { sound } from '../../services/sound';
import { ArrowDown, ArrowUp, CheckCircle2, GripVertical, Play } from 'lucide-react';

export interface ProcedureStepItem {
  id: string;
  label: string;
  criticalNote?: string;
}

interface ProcedureSorterProps {
  title: string;
  instruction: string;
  steps: ProcedureStepItem[];
  expectedOrder: string[];
  disabled?: boolean;
  onSuccess: () => void;
  onMistake?: (feedback: string) => void;
}

export const ProcedureSorter: React.FC<ProcedureSorterProps> = ({
  title,
  instruction,
  steps,
  expectedOrder,
  disabled = false,
  onSuccess,
  onMistake,
}) => {
  const [ordered, setOrdered] = useState<ProcedureStepItem[]>(steps);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const moveItem = (from: number, to: number) => {
    if (disabled || to < 0 || to >= ordered.length || from === to) return;
    sound.playClick();
    setFeedback(null);
    setOrdered((prev) => {
      const next = [...prev];
      const [removed] = next.splice(from, 1);
      next.splice(to, 0, removed);
      return next;
    });
  };

  const handleRunSequence = () => {
    if (disabled) return;
    for (let i = 0; i < expectedOrder.length; i++) {
      if (ordered[i]?.id !== expectedOrder[i]) {
        sound.playAlert();
        const wrongStep = ordered[i];
        const expectedStep = steps.find((s) => s.id === expectedOrder[i]);
        const msg =
          wrongStep?.criticalNote ||
          `Sai thứ tự tại bước ${i + 1}! Cần thực hiện "${expectedStep?.label}" trước khi chuyển sang "${wrongStep?.label}".`;
        setFeedback({ ok: false, text: msg });
        onMistake?.(msg);
        return;
      }
    }

    sound.playSuccess();
    setFeedback({
      ok: true,
      text: 'Quy trình kỹ thuật chuẩn xác! Mọi bước kiểm tra và an toàn đều được thực thi đúng thứ tự.',
    });
    onSuccess();
  };

  return (
    <div className="rounded-2xl bg-sky-50/70 border-2 border-sky-200 p-4 space-y-3">
      <div>
        <h3 className="text-sm font-extrabold text-sky-950">{title}</h3>
        <p className="text-xs font-medium text-sky-800/85 mt-0.5">{instruction}</p>
      </div>

      <div className="space-y-2">
        {ordered.map((step, index) => (
          <div
            key={step.id}
            draggable={!disabled}
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex !== null) moveItem(dragIndex, index);
              setDragIndex(null);
            }}
            onDragEnd={() => setDragIndex(null)}
            className={`p-3 rounded-xl bg-white border-2 flex items-center justify-between gap-2 transition-all ${
              dragIndex === index ? 'border-amber-400 opacity-75' : 'border-sky-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <GripVertical className="w-4 h-4 text-sky-400 shrink-0 cursor-grab" />
              <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 text-xs font-extrabold flex items-center justify-center shrink-0 tabular-nums">
                {index + 1}
              </span>
              <span className="text-xs sm:text-sm font-bold text-sky-950">{step.label}</span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                disabled={disabled || index === 0}
                onClick={() => moveItem(index, index - 1)}
                aria-label="Đưa bước lên"
                className="w-8 h-8 rounded-lg bg-sky-50 hover:bg-sky-100 disabled:opacity-35 text-sky-800 flex items-center justify-center cursor-pointer"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={disabled || index === ordered.length - 1}
                onClick={() => moveItem(index, index + 1)}
                aria-label="Đưa bước xuống"
                className="w-8 h-8 rounded-lg bg-sky-50 hover:bg-sky-100 disabled:opacity-35 text-sky-800 flex items-center justify-center cursor-pointer"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            feedback.ok
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {feedback.ok && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={handleRunSequence}
        className="min-h-11 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm"
      >
        <Play className="w-4 h-4" />
        <span>Thực thi quy trình đã sắp xếp</span>
      </button>
    </div>
  );
};
