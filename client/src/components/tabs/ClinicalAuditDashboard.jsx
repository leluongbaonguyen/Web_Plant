import { useState } from 'react';
import {
  Stethoscope, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Activity,
  Lock, Key, Clock, Award, UserCheck, RefreshCw, Sparkles, Filter, ChevronRight, AlertCircle
} from 'lucide-react';

export function ClinicalAuditDashboard({ plan, addToast }) {
  const [approvedItems, setApprovedItems] = useState(['aud-1', 'aud-2']);
  const [activeSubTab, setActiveSubTab] = useState('pending'); // 'pending' | 'approved' | 'warnings'

  const clinicalCases = [
    {
      id: 'case-01',
      patientName: 'Chị Thu Hà (Tuần 24 - Thai Kỳ)',
      roleType: 'pregnant',
      kickCount: 12,
      kickDuration: '45 phút',
      kickStatus: 'NORMAL',
      bloodPressure: '120/80 mmHg',
      weightGain: '+6.5 kg',
      urgentFlag: false,
      lastCheckIn: 'Hôm nay - 08:30 AM',
      notes: 'Thai nhi cử động đều đặn. Không có triệu chứng huyết áp cao hay sưng phù chân.',
    },
    {
      id: 'case-02',
      patientName: 'Chị Thanh Mai (Ngày 21 - Sau Sinh)',
      roleType: 'postpartum',
      feedingLogs: '8 cữ bú (Total 640 mL sữa mẹ)',
      epdsScore: 4,
      epdsRisk: 'LOW_RISK',
      incisionStatus: 'Lành tốt, không sưng đỏ',
      urgentFlag: false,
      lastCheckIn: 'Hôm nay - 07:15 AM',
      notes: 'Bé bú ngoan, ngủ 14 tiếng/ngày. Mẹ phục hồi thể trạng tốt.',
    },
    {
      id: 'case-03',
      patientName: 'Chị Hoàng Yến (Tuần 32 - Thai Kỳ)',
      roleType: 'pregnant',
      kickCount: 4,
      kickDuration: '120 phút',
      kickStatus: 'ALERT_LOW_KICK',
      bloodPressure: '138/90 mmHg',
      weightGain: '+12 kg',
      urgentFlag: true,
      lastCheckIn: 'Hôm nay - 06:00 AM',
      notes: '⚠️ Thai máy dưới 10 lần/2 tiếng. Cần thẩm định lại chỉ số cử động thai gấp!',
    },
  ];

  const handleApproveCase = (caseId, patientName) => {
    if (approvedItems.includes(caseId)) return;
    const next = [...approvedItems, caseId];
    setApprovedItems(next);
    if (addToast) {
      addToast(`🩺 Đã hoàn tất Phê Duyệt Lâm Sàng 5 Bước cho ${patientName}`, 'success');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Clinician Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/40 bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-1.5 text-xs font-black text-purple-300">
              <Stethoscope className="h-4 w-4 text-purple-400" />
              <span>CỔNG THẨM ĐỊNH LÂM SÀNG DÀNH CHO NGƯỜI DUYỆT CHUYÊN MÔN 🩺</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Hệ Thống Phê Duyệt <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300">Chỉ Số Y Tế 5 Bước</span>
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Dành riêng cho Bác sĩ & Chuyên gia Y tế: Thẩm định hồ sơ cử động thai máy, theo dõi cữ bú em bé, sàng lọc EPDS trầm cảm sau sinh và xác thực HMAC audit trail.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 rounded-2xl border border-purple-500/40 bg-purple-950/60 px-4 py-2 text-xs font-black text-purple-300">
                <UserCheck className="h-4 w-4 text-purple-400" />
                <span>BS. CKII Nguyễn Thị Mai</span>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/60 px-4 py-2 text-xs font-black text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Đã Duyệt {approvedItems.length} Hồ Sơ Hôm Nay</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 rounded-3xl border border-purple-500/40 bg-slate-900/90 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="text-7xl animate-pulse">🩺</div>
              <div className="text-xs font-black text-purple-300 font-heading">CHUYÊN GIA LÂM SÀNG</div>
              <div className="rounded-full bg-purple-600 px-3 py-0.5 text-[10px] font-bold text-white">
                Bác Sĩ Duyệt Độc Lập
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Sub-Tabs */}
      <div className="flex rounded-2xl bg-slate-950 p-1.5 border border-slate-800">
        <button
          onClick={() => setActiveSubTab('pending')}
          className={`flex-1 py-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeSubTab === 'pending' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Danh Sách Hồ Sơ Cần Thẩm Đinh ({clinicalCases.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('warnings')}
          className={`flex-1 py-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeSubTab === 'warnings' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="h-4 w-4 text-yellow-300 animate-pulse" />
          <span>Cảnh Báo Lâm Sàng Khẩn Cấp (1 Case)</span>
        </button>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {clinicalCases
          .filter((c) => (activeSubTab === 'warnings' ? c.urgentFlag : true))
          .map((item) => {
            const isApproved = approvedItems.includes(item.id);

            return (
              <div
                key={item.id}
                className={`rounded-3xl border p-5 transition backdrop-blur-xl bg-slate-900/90 shadow-xl ${
                  item.urgentFlag
                    ? 'border-rose-500/60 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl text-2xl ${item.roleType === 'pregnant' ? 'bg-pink-950 border border-pink-500/40' : 'bg-amber-950 border border-amber-500/40'}`}>
                      {item.roleType === 'pregnant' ? '🤰' : '🤱'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-white">{item.patientName}</h3>
                        {item.urgentFlag && (
                          <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white animate-pulse">
                            CẦN XỬ LÝ GẤP
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">Cập nhật: {item.lastCheckIn}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApproveCase(item.id, item.patientName)}
                    disabled={isApproved}
                    className={`flex items-center gap-1.5 rounded-2xl px-5 py-2.5 text-xs font-black transition shadow-lg ${
                      isApproved
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isApproved ? 'Đã Phê Duyệt 5 Bước ✓' : 'Phê Duyệt Lâm Sàng'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Chỉ Số Thai Máy / Cữ Bú:</span>
                    <div className="font-bold text-slate-100">{item.kickCount ? `${item.kickCount} lần / ${item.kickDuration}` : item.feedingLogs}</div>
                  </div>

                  <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Huyết Áp & Tế Bào Sức Khỏe:</span>
                    <div className="font-bold text-slate-100">{item.bloodPressure || item.incisionStatus}</div>
                  </div>

                  <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Ghi Chú Y Tế:</span>
                    <div className="text-slate-300 italic">{item.notes}</div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
