import React from 'react';
import { EquipmentSubsystemId, MissionSessionState } from '../../types/game';
import { getEffectiveSubsystemState, getSubsystemBlueprint } from '../../data/equipmentSystems';
import { AlertOctagon, AlertTriangle, Wrench } from 'lucide-react';
import { sound } from '../../services/sound';

interface SubsystemLockNoticeProps {
  session: MissionSessionState;
  subsystemId: EquipmentSubsystemId;
  actionLabel: string;
  onOpenRepair: (targetSubsystem?: EquipmentSubsystemId) => void;
}

export const SubsystemLockNotice: React.FC<SubsystemLockNoticeProps> = ({
  session,
  subsystemId,
  actionLabel,
  onOpenRepair,
}) => {
  const effective = getEffectiveSubsystemState(session, subsystemId);
  const bp = getSubsystemBlueprint(subsystemId);
  const rt = session.subsystems[subsystemId];

  if (effective.status === 'ok' || !bp) return null;

  const isFailed = effective.status === 'failed';

  return (
    <div
      className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isFailed ? 'bg-rose-50 border-rose-300' : 'bg-amber-50 border-amber-300'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {isFailed ? (
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        )}
        <div className="space-y-0.5">
          <div className={`text-sm font-extrabold ${isFailed ? 'text-rose-900' : 'text-amber-950'}`}>
            {isFailed
              ? `Vô hiệu hóa "${actionLabel}" — Lỗi từ: ${effective.blockedBy || bp.name}`
              : `Suy giảm "${actionLabel}" — ${effective.degradedBy ? `Ảnh hưởng từ ${effective.degradedBy}` : rt?.faultTitle || bp.name}`}
          </div>
          <div className={`text-xs font-medium ${isFailed ? 'text-rose-800' : 'text-amber-900'}`}>
            {effective.blockedBy
              ? `Bộ phận "${bp.name}" phụ thuộc vào "${effective.blockedBy}" đang bị hỏng. Các chức năng không liên quan vẫn hoạt động bình thường.`
              : rt?.faultCause || 'Hãy kiểm tra và sửa chữa bộ phận gặp sự cố để khôi phục hiệu suất.'}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          sound.playClick();
          onOpenRepair(subsystemId);
        }}
        className="min-h-10 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
      >
        <Wrench className="w-4 h-4" />
        <span>Sửa ngay</span>
      </button>
    </div>
  );
};
