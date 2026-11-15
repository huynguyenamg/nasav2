import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../../types/game';
import { sound } from '../../services/sound';
import { AlertTriangle, CheckCircle2, Power, RotateCcw, Zap } from 'lucide-react';

export interface WireNode {
  id: string;
  label: string;
  color: string;
  sublabel?: string;
}

export interface ExpectedWireConnection {
  fromId: string;
  toId: string;
  errorHint?: string;
}

interface CircuitWiringBoardProps {
  title: string;
  instruction: string;
  leftNodes: WireNode[];
  rightNodes: WireNode[];
  expectedConnections: ExpectedWireConnection[];
  lang?: Language;
  disabled?: boolean;
  onSuccess: () => void;
  onFault?: (reason: string) => void;
}

interface ActiveConnection {
  fromId: string;
  toId: string;
}

export const CircuitWiringBoard: React.FC<CircuitWiringBoardProps> = ({
  title,
  instruction,
  leftNodes,
  rightNodes,
  expectedConnections,
  lang = 'vi',
  disabled = false,
  onSuccess,
  onFault,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [connections, setConnections] = useState<ActiveConnection[]>([]);
  const [dragLine, setDragLine] = useState<{
    fromId: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);
  const [powerOn, setPowerOn] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    kind: 'info' | 'ok' | 'error';
    text: string;
    isDefault?: boolean;
  }>({
    kind: 'info',
    text: instruction,
    isDefault: true,
  });

  useEffect(() => {
    setStatusMsg((prev) => {
      if (prev.isDefault) {
        return { kind: 'info', text: instruction, isDefault: true };
      }
      if (prev.kind === 'ok') {
        return {
          kind: 'ok',
          text:
            lang === 'en'
              ? 'Circuit verified and safe! Power and telemetry signals are nominal.'
              : 'Mạch điện thông suốt và an toàn! Dòng điện & tín hiệu đang chạy ổn định.',
        };
      }
      return prev;
    });
  }, [instruction, lang]);

  const getPortCenter = (side: 'left' | 'right', id: string) => {
    const board = boardRef.current;
    if (!board) return { x: 0, y: 0 };
    const portEl = board.querySelector(`[data-port="${side}-${id}"]`) as HTMLElement | null;
    if (!portEl) return { x: 0, y: 0 };
    const bRect = board.getBoundingClientRect();
    const pRect = portEl.getBoundingClientRect();
    return {
      x: pRect.left - bRect.left + pRect.width / 2,
      y: pRect.top - bRect.top + pRect.height / 2,
    };
  };

  const linkNodes = (fromId: string, toId: string) => {
    if (disabled) return;
    sound.playEquip();
    setPowerOn(false);
    setConnections((prev) => {
      const filtered = prev.filter((c) => c.fromId !== fromId && c.toId !== toId);
      return [...filtered, { fromId, toId }];
    });
    setSelectedLeft(null);
    setStatusMsg({
      kind: 'info',
      text:
        lang === 'en'
          ? 'Wire connected! Complete all ports, then turn on the Power Switch to verify the circuit.'
          : 'Đã nối dây! Hãy hoàn tất tất cả các cổng rồi bật Công tắc Nguồn để kiểm tra mạch.',
    });
  };

  const handleLeftPointerDown = (e: React.PointerEvent, fromId: string) => {
    if (disabled) return;
    e.preventDefault();
    setSelectedLeft(fromId);
    const start = getPortCenter('left', fromId);
    setDragLine({
      fromId,
      x1: start.x,
      y1: start.y,
      x2: start.x,
      y2: start.y,
    });
  };

  const handleBoardPointerMove = (e: React.PointerEvent) => {
    if (!dragLine || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    setDragLine((prev) =>
      prev
        ? {
            ...prev,
            x2: e.clientX - rect.left,
            y2: e.clientY - rect.top,
          }
        : null
    );
  };

  const handleBoardPointerUp = (e: React.PointerEvent) => {
    if (!dragLine || !boardRef.current) return;
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    const rightEl = hit?.closest('[data-port-side="right"]') as HTMLElement | null;
    const toId = rightEl?.dataset.portId;
    if (toId) {
      linkNodes(dragLine.fromId, toId);
    }
    setDragLine(null);
  };

  const handleTogglePower = () => {
    if (disabled) return;
    if (connections.length < expectedConnections.length) {
      sound.playAlert();
      const msg =
        lang === 'en'
          ? `Circuit incomplete (${connections.length}/${expectedConnections.length} wires)! Connect all ports before powering on.`
          : `Mạch chưa khép kín (${connections.length}/${expectedConnections.length} dây)! Hãy nối đủ tất cả cổng trước khi bật nguồn.`;
      setStatusMsg({ kind: 'error', text: msg });
      onFault?.(msg);
      return;
    }

    const mismatch = expectedConnections.find((exp) => {
      const actual = connections.find((c) => c.fromId === exp.fromId);
      return !actual || actual.toId !== exp.toId;
    });

    if (mismatch) {
      sound.playAlert();
      setPowerOn(false);
      const fromLabel = leftNodes.find((n) => n.id === mismatch.fromId)?.label || mismatch.fromId;
      const msg =
        mismatch.errorHint ||
        (lang === 'en'
          ? `Port mismatch at "${fromLabel}"! Reconnect to the matching receiver terminal.`
          : `Chập/sai cổng tại "${fromLabel}"! Hãy tháo dây sai và nối lại đúng đầu thu tương ứng.`);
      setStatusMsg({ kind: 'error', text: msg });
      onFault?.(msg);
      return;
    }

    sound.playSuccess();
    setPowerOn(true);
    setStatusMsg({
      kind: 'ok',
      text:
        lang === 'en'
          ? 'Circuit verified and safe! Power and telemetry signals are nominal.'
          : 'Mạch điện thông suốt và an toàn! Dòng điện & tín hiệu đang chạy ổn định.',
    });
    onSuccess();
  };

  const handleReset = () => {
    sound.playClick();
    setConnections([]);
    setSelectedLeft(null);
    setPowerOn(false);
    setStatusMsg({ kind: 'info', text: instruction, isDefault: true });
  };

  return (
    <div className="rounded-2xl bg-sky-50/70 border-2 border-sky-200 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <h3 className="text-sm font-extrabold text-sky-950">{title}</h3>
        </div>
        <button
          type="button"
          onClick={handleReset}
          disabled={disabled}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Reset wires' : 'Tháo dây nối lại'}</span>
        </button>
      </div>

      {/* Wiring Canvas */}
      <div
        ref={boardRef}
        onPointerMove={handleBoardPointerMove}
        onPointerUp={handleBoardPointerUp}
        onPointerCancel={() => setDragLine(null)}
        className="relative rounded-2xl bg-white border-2 border-sky-200 p-3 sm:p-4 select-none touch-none"
      >
        {/* SVG Wire Layer */}
        <svg className="pointer-events-none absolute inset-0 w-full h-full z-10 overflow-visible">
          {connections.map((conn) => {
            const p1 = getPortCenter('left', conn.fromId);
            const p2 = getPortCenter('right', conn.toId);
            const node = leftNodes.find((n) => n.id === conn.fromId);
            const isExpected = expectedConnections.some(
              (e) => e.fromId === conn.fromId && e.toId === conn.toId
            );
            const strokeColor = powerOn && isExpected ? '#10b981' : node?.color || '#0284c7';
            const midX = (p1.x + p2.x) / 2;

            return (
              <path
                key={`${conn.fromId}-${conn.toId}`}
                d={`M ${p1.x} ${p1.y} C ${midX} ${p1.y}, ${midX} ${p2.y}, ${p2.x} ${p2.y}`}
                fill="none"
                stroke={strokeColor}
                strokeWidth={powerOn ? 5 : 4}
                strokeLinecap="round"
                strokeDasharray={powerOn ? '8 5' : undefined}
              />
            );
          })}

          {dragLine && (
            <path
              d={`M ${dragLine.x1} ${dragLine.y1} C ${(dragLine.x1 + dragLine.x2) / 2} ${dragLine.y1}, ${(dragLine.x1 + dragLine.x2) / 2} ${dragLine.y2}, ${dragLine.x2} ${dragLine.y2}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />
          )}
        </svg>

        <div className="grid grid-cols-2 gap-4 sm:gap-12 relative z-20">
          {/* Left Source Ports */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-extrabold text-sky-700">
              {lang === 'en' ? 'Source / Output' : 'Cổng nguồn / Phát'}
            </div>
            {leftNodes.map((node) => {
              const isSelected = selectedLeft === node.id;
              const isLinked = connections.some((c) => c.fromId === node.id);

              return (
                <div
                  key={node.id}
                  onPointerDown={(e) => handleLeftPointerDown(e, node.id)}
                  onClick={() => {
                    if (disabled) return;
                    sound.playClick();
                    setSelectedLeft(isSelected ? null : node.id);
                  }}
                  className={`p-2.5 rounded-xl border-2 flex items-center justify-between gap-2 cursor-grab active:cursor-grabbing transition-all ${
                    isSelected
                      ? 'bg-amber-50 border-amber-400 shadow-sm'
                      : isLinked
                      ? 'bg-sky-50 border-sky-400'
                      : 'bg-white border-sky-200 hover:border-sky-400'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="text-xs font-extrabold text-sky-950 leading-snug break-words">{node.label}</div>
                    {node.sublabel && (
                      <div className="text-[11px] font-medium text-sky-700 leading-snug break-words">
                        {node.sublabel}
                      </div>
                    )}
                  </div>
                  <span
                    data-port={`left-${node.id}`}
                    className="w-4 h-4 rounded-full border-2 border-white shadow shrink-0"
                    style={{ backgroundColor: node.color }}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Target Ports */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-extrabold text-sky-700 text-right">
              {lang === 'en' ? 'Target / Input' : 'Cổng thiết bị / Thu'}
            </div>
            {rightNodes.map((node) => {
              const linkedBy = connections.find((c) => c.toId === node.id);

              return (
                <div
                  key={node.id}
                  data-port-side="right"
                  data-port-id={node.id}
                  onClick={() => {
                    if (disabled) return;
                    if (selectedLeft) {
                      linkNodes(selectedLeft, node.id);
                    } else if (linkedBy) {
                      sound.playClick();
                      setPowerOn(false);
                      setConnections((prev) => prev.filter((c) => c.toId !== node.id));
                    }
                  }}
                  className={`p-2.5 rounded-xl border-2 flex items-center justify-between gap-2 cursor-pointer transition-all ${
                    linkedBy
                      ? 'bg-emerald-50/70 border-emerald-400'
                      : selectedLeft
                      ? 'bg-amber-50/50 border-amber-300 border-dashed'
                      : 'bg-white border-sky-200 hover:border-sky-400'
                  }`}
                >
                  <span
                    data-port={`right-${node.id}`}
                    className="w-4 h-4 rounded-full border-2 border-white shadow shrink-0"
                    style={{ backgroundColor: node.color }}
                  />
                  <div className="min-w-0 flex-1 text-right space-y-0.5">
                    <div className="text-xs font-extrabold text-sky-950 leading-snug break-words">{node.label}</div>
                    {node.sublabel && (
                      <div className="text-[11px] font-medium text-sky-700 leading-snug break-words">
                        {node.sublabel}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feedback + Power Switch */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div
          className={`flex-1 p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            statusMsg.kind === 'ok'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : statusMsg.kind === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-white border-sky-200 text-sky-900'
          }`}
        >
          {statusMsg.kind === 'ok' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : statusMsg.kind === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <Zap className="w-4 h-4 text-sky-500 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={handleTogglePower}
          className={`min-h-11 px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm ${
            powerOn
              ? 'bg-emerald-500 text-white'
              : 'bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>
            {powerOn
              ? lang === 'en'
                ? 'Power verified ✓'
                : 'Nguồn đã bật ổn định ✓'
              : lang === 'en'
              ? 'Power On & Test Circuit'
              : 'Bật nguồn kiểm tra mạch'}
          </span>
        </button>
      </div>
    </div>
  );
};
