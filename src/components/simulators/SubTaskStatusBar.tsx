import React from 'react';
import { Language } from '../../types/game';
import { sound } from '../../services/sound';
import { AlertOctagon, CheckCircle2, Circle } from 'lucide-react';

export interface SubTaskItem<T extends string = string> {
  key: T;
  label: string;
  icon: React.ReactNode;
  hasError?: boolean;
}

interface SubTaskStatusBarProps<T extends string = string> {
  tasks: SubTaskItem<T>[];
  activeTask: T;
  completedTasks: string[];
  failedTasks?: string[];
  lang: Language;
  onSelect: (key: T) => void;
}

export function SubTaskStatusBar<T extends string = string>({
  tasks,
  activeTask,
  completedTasks,
  failedTasks = [],
  lang,
  onSelect,
}: SubTaskStatusBarProps<T>) {
  const isEn = lang === 'en';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {tasks.map((t) => {
        const active = activeTask === t.key;
        const done = completedTasks.includes(t.key);
        const isError = !done && (Boolean(t.hasError) || failedTasks.includes(t.key));

        const statusLabel = done
          ? isEn
            ? 'Completed'
            : 'Hoàn thành'
          : isError
          ? isEn
            ? 'Needs fix'
            : 'Gặp lỗi'
          : active
          ? isEn
            ? 'In progress'
            : 'Đang làm'
          : isEn
          ? 'Not started'
          : 'Chưa làm';

        let containerStyle =
          'bg-slate-100 text-slate-700 border-slate-300 hover:bg-white hover:border-slate-400';
        let badgeStyle = 'text-slate-600';

        if (done) {
          if (active) {
            containerStyle =
              'bg-emerald-600 text-white border-emerald-700 ring-2 ring-sky-400 shadow-sm';
            badgeStyle = 'text-emerald-100';
          } else {
            containerStyle =
              'bg-emerald-50 text-emerald-950 border-emerald-500 hover:bg-emerald-100/80';
            badgeStyle = 'text-emerald-700';
          }
        } else if (isError) {
          if (active) {
            containerStyle =
              'bg-rose-600 text-white border-rose-700 ring-2 ring-sky-400 shadow-sm';
            badgeStyle = 'text-rose-100';
          } else {
            containerStyle =
              'bg-rose-50 text-rose-950 border-rose-400 hover:bg-rose-100/70';
            badgeStyle = 'text-rose-700';
          }
        } else if (active) {
          containerStyle = 'bg-sky-600 text-white border-sky-700 shadow-sm';
          badgeStyle = 'text-sky-100';
        }

        return (
          <button
            key={t.key}
            type="button"
            data-task-key={t.key}
            data-task-status={done ? 'completed' : isError ? 'error' : active ? 'active' : 'pending'}
            onClick={() => {
              sound.playClick();
              onSelect(t.key);
            }}
            className={`min-h-14 px-3.5 py-2.5 rounded-xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${containerStyle}`}
          >
            <div className="flex items-start justify-between gap-2 w-full">
              <span className="flex items-start gap-1.5 min-w-0 font-bold text-xs sm:text-sm leading-snug">
                <span className="shrink-0 mt-0.5">{t.icon}</span>
                <span className="break-words">{t.label}</span>
              </span>

              {done ? (
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    active ? 'text-white' : 'text-emerald-600'
                  }`}
                />
              ) : isError ? (
                <AlertOctagon
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    active ? 'text-white' : 'text-rose-600'
                  }`}
                />
              ) : active ? (
                <Circle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-sky-200 fill-current" />
              ) : null}
            </div>

            <div className={`text-[11px] font-semibold leading-none ${badgeStyle}`}>
              {statusLabel}
            </div>
          </button>
        );
      })}
    </div>
  );
}
