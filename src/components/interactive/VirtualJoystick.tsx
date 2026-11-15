import React, { useRef, useState } from 'react';
import { Language } from '../../types/game';

interface VirtualJoystickProps {
  disabled?: boolean;
  onVectorMove: (dxNorm: number, dyNorm: number, angleDeg: number) => void;
  label?: string;
  lang?: Language;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  disabled = false,
  onVectorMove,
  label,
  lang = 'vi',
}) => {
  const resolvedLabel =
    label || (lang === 'en' ? 'Control Stick (Drag)' : 'Cần điều khiển (Kéo thả)');
  const padRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const radius = 38;

  const updateFromPointer = (clientX: number, clientY: number) => {
    const pad = padRef.current;
    if (!pad || disabled) return;
    const rect = pad.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rawX = clientX - cx;
    const rawY = clientY - cy;
    const dist = Math.hypot(rawX, rawY);
    const clamped = Math.min(radius, dist);
    const angleRad = Math.atan2(rawY, rawX);
    const x = Math.cos(angleRad) * clamped;
    const y = Math.sin(angleRad) * clamped;
    setKnob({ x, y });

    if (clamped >= 10) {
      const deg = Math.round((angleRad * 180) / Math.PI);
      onVectorMove(x / radius, y / radius, deg);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <div
        ref={padRef}
        onPointerDown={(e) => {
          if (disabled) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          setActive(true);
          updateFromPointer(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (!active || disabled) return;
          updateFromPointer(e.clientX, e.clientY);
        }}
        onPointerUp={() => {
          setActive(false);
          setKnob({ x: 0, y: 0 });
        }}
        onPointerCancel={() => {
          setActive(false);
          setKnob({ x: 0, y: 0 });
        }}
        className={`w-28 h-28 rounded-full border-2 flex items-center justify-center relative touch-none ${
          disabled
            ? 'bg-slate-100 border-slate-300 opacity-55 cursor-not-allowed'
            : 'bg-white/95 border-sky-300 shadow-md cursor-grab active:cursor-grabbing'
        }`}
      >
        <div className="w-14 h-14 rounded-full border border-dashed border-sky-200 pointer-events-none" />
        <div
          className="w-11 h-11 rounded-full bg-sky-500 border-4 border-white shadow-lg absolute pointer-events-none transition-transform duration-75"
          style={{
            transform: `translate(${knob.x}px, ${knob.y}px)`,
          }}
        />
      </div>
      <span className="text-[11px] font-extrabold text-sky-950 bg-white/90 px-2 py-0.5 rounded-lg border border-sky-200">
        {resolvedLabel}
      </span>
    </div>
  );
};
