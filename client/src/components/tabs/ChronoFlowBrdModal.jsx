import React, { useState } from 'react';

export default function ChronoFlowBrdModal({ isOpen, onClose, addToast }) {
  const [activeSection, setActiveSection] = useState('control');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleDownloadDocx = () => {
    window.open('/api/export/brd-doc', '_blank');
    addToast?.('Đang khởi tạo và tải xuống tệp đặc tả BRD (.docx)...', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-2xl shadow-inner">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  CFP-BRD-IVB-002 v2.0
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  APPROVED / PUBLISHED
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">
                Tài Liệu Đặc Tả Nghiệp Vụ Nâng Cấp: Bảng Từ Vựng Minh Họa 12 Trang
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadDocx}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition flex items-center gap-2"
            >
              <span>📥 Tải Tệp Word (.docx)</span>
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition flex items-center justify-center font-bold text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-800/80 px-6 py-3 border-b border-slate-700 flex items-center gap-2 overflow-x-auto text-sm font-medium">
          {[
            { id: 'control', label: '📋 Control & History' },
            { id: 'arch', label: '🏗️ 3-Tier Model' },
            { id: 'pages12', label: '🖼️ 12 Poster Pages' },
            { id: 'crud', label: '⚙️ CRUD & Soft Delete' },
            { id: 'ai', label: '🤖 AI Scanner' },
            { id: 'audio', label: '🔊 Audio Telemetry' },
            { id: 'import', label: '📦 Batch 8-Step' },
            { id: 'qa', label: '🎯 QA & Security' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeSection === tab.id
                  ? 'bg-indigo-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm leading-relaxed">
          {activeSection === 'control' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700">
                <h3 className="text-lg font-bold text-indigo-300 mb-3 flex items-center gap-2">
                  <span>📌</span> THÔNG TIN KIỂM SOÁT TÀI LIỆU (DOCUMENT CONTROL)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400 text-xs block">Tên dự án</span>
                    <strong className="text-white text-base">ChronoFlow Premium Learning Infrastructure</strong>
                  </div>
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400 text-xs block">Mã tài liệu</span>
                    <strong className="text-indigo-400 text-base font-mono">CFP-BRD-IVB-002</strong>
                  </div>
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400 text-xs block">Phiên bản</span>
                    <strong className="text-emerald-400 text-base font-mono">v2.0 (Official Release)</strong>
                  </div>
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400 text-xs block">Ngày phát hành</span>
                    <strong className="text-white text-base">31/07/2026</strong>
                  </div>
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400 text-xs block">Tác giả & Đơn vị</span>
                    <strong className="text-purple-300 text-base">ChronoFlow Architecture & QA Team</strong>
                  </div>
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400 text-xs block">Trạng thái phê duyệt</span>
                    <strong className="text-amber-300 text-base">APPROVED / PUBLISHED 4-EYES</strong>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700">
                <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
                  <span>📜</span> LỊCH SỬ THAY ĐỔI PHIÊN BẢN (REVISION HISTORY)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 text-xs">
                        <th className="py-2.5 px-3">Phiên bản</th>
                        <th className="py-2.5 px-3">Ngày</th>
                        <th className="py-2.5 px-3">Tóm tắt nâng cấp</th>
                        <th className="py-2.5 px-3">Tác giả</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50 text-slate-200">
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-400">v1.0</td>
                        <td className="py-2.5 px-3">28/07/2026</td>
                        <td className="py-2.5 px-3">Khởi tạo đặc tả Bảng từ vựng minh họa 8 trang ban đầu</td>
                        <td className="py-2.5 px-3">Content Team</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">v2.0</td>
                        <td className="py-2.5 px-3">31/07/2026</td>
                        <td className="py-2.5 px-3">Nâng cấp 12 Trang full level, CRUD versioning, AI scan, Audio telemetry, Batch Dry-run & Rollback job</td>
                        <td className="py-2.5 px-3">ChronoFlow Enterprise Team</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'arch' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700">
                <h3 className="text-lg font-bold text-emerald-300 mb-3">
                  🏗️ MÔ HÌNH DỮ LIỆU 3 CẤP (3-TIER DATA HIERARCHY)
                </h3>
                <p className="text-slate-300 mb-4">
                  Dữ liệu được tổ chức chặt chẽ thành 3 tầng phân cấp nguyên tử để đảm bảo khả năng quản trị, tìm kiếm và truy xuất hiệu năng cao:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-indigo-500/30">
                    <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Cấp 1 • Tầng Trang</div>
                    <div className="text-lg font-extrabold text-white">Illustrated Poster Page</div>
                    <p className="text-xs text-slate-400 mt-2">
                      Đại diện cho 1 trang từ vựng minh họa (Trang 1 đến Trang 12), chứa thông tin tiêu đề, phụ đề, ảnh poster, theme color và thứ tự sắp xếp.
                    </p>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-purple-500/30">
                    <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Cấp 2 • Tầng Phân Vùng</div>
                    <div className="text-lg font-extrabold text-white">Poster Region / Topic</div>
                    <p className="text-xs text-slate-400 mt-2">
                      Phân vùng chủ đề trong trang (mỗi trang có 4 phân vùng). Chứa tên phân vùng EN/VI, badge color, icon đại diện và danh sách mã từ vựng.
                    </p>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30">
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Cấp 3 • Tầng Thẻ Từ Vựng</div>
                    <div className="text-lg font-extrabold text-white">Vocabulary Card & Media</div>
                    <p className="text-xs text-slate-400 mt-2">
                      Thẻ từ vựng siêu chi tiết: Từ EN, Nghĩa VI, IPA chuẩn, Phiên âm tiếng Việt cho bé, Ví dụ song ngữ, Mẹo ghi nhớ, Audio & Hình ảnh icon.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'pages12' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700">
                <h3 className="text-lg font-bold text-amber-300 mb-3">
                  🖼️ BẢNG BÌNH DIỆN QUY HOẠCH 12 TRANG HỌC LIỆU MINH HỌA
                </h3>
                <p className="text-slate-300 mb-4">
                  Hệ thống được thiết kế với chính xác 12 Trang từ vựng minh họa trực quan bao phủ từ Cấp độ L1 đến L4:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="py-2.5 px-3">Trang</th>
                        <th className="py-2.5 px-3">Cấp độ (Level)</th>
                        <th className="py-2.5 px-3">Tiêu đề trang</th>
                        <th className="py-2.5 px-3">Số phân vùng</th>
                        <th className="py-2.5 px-3">Chủ đề chính</th>
                        <th className="py-2.5 px-3">Mục tiêu từ vựng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50 text-slate-200">
                      {[
                        { page: 1, level: 'L1', title: 'Illustrated English Vocabulary - Page 1', regions: 4, topics: 'Colors, Numbers, Shapes, Family', target: '40 Từ' },
                        { page: 2, level: 'L1', title: 'Illustrated English Vocabulary - Page 2', regions: 4, topics: 'Body, Animals, Food & Drinks, Classroom', target: '40 Từ' },
                        { page: 3, level: 'L1-L2', title: 'Illustrated English Vocabulary - Page 3', regions: 4, topics: 'Actions, Feelings, Home, Clothes', target: '40 Từ' },
                        { page: 4, level: 'L2', title: 'Illustrated English Vocabulary - Page 4', regions: 4, topics: 'Daily Routine, Weather, Transport, Places', target: '40 Từ' },
                        { page: 5, level: 'L2', title: 'Illustrated English Vocabulary - Page 5', regions: 4, topics: 'Jobs, Fruits & Veggies, Time, Sports', target: '40 Từ' },
                        { page: 6, level: 'L2-L3', title: 'Illustrated English Vocabulary - Page 6', regions: 4, topics: 'Nature, Health, Shopping, Travel', target: '40 Từ' },
                        { page: 7, level: 'L3', title: 'Illustrated English Vocabulary - Page 7', regions: 4, topics: 'Technology, Hobbies, Community, Festivals', target: '40 Từ' },
                        { page: 8, level: 'L3', title: 'Illustrated English Vocabulary - Page 8', regions: 4, topics: 'Personality, Protect Earth, Science, Space', target: '40 Từ' },
                        { page: 9, level: 'L4', title: 'Illustrated English Vocabulary - Page 9', regions: 4, topics: 'Academic, Communication, Problems, Feelings', target: '40 Từ' },
                        { page: 10, level: 'L4', title: 'Illustrated English Vocabulary - Page 10', regions: 4, topics: 'Culture, Safety, Stories, Goals', target: '40 Từ' },
                        { page: 11, level: 'L4', title: 'Illustrated English Vocabulary - Page 11', regions: 4, topics: 'Science, Math, Art & Design, Inside Body', target: '40 Từ' },
                        { page: 12, level: 'L4', title: 'Illustrated English Vocabulary - Page 12', regions: 4, topics: 'Society, Careers, Global Environment, Values', target: '40 Từ' },
                      ].map((row) => (
                        <tr key={row.page} className="hover:bg-slate-800/80 transition">
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-400">Trang {row.page}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">{row.level}</span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-white">{row.title}</td>
                          <td className="py-2.5 px-3">{row.regions} phân vùng</td>
                          <td className="py-2.5 px-3 text-slate-300">{row.topics}</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">{row.target}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'crud' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700">
                <h3 className="text-lg font-bold text-sky-300 mb-3">
                  ⚙️ QUY TRÌNH CRUD NÂNG CAO, SOFT DELETE & THÙNG RÁC
                </h3>
                <ul className="space-y-3">
                  <li className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                    <strong className="text-white block mb-1">1. Xóa mềm (Soft Delete) có lý do bắt buộc</strong>
                    Khi thực hiện xóa từ vựng, hệ thống yêu cầu nhập lý do xóa (tối thiểu 3 ký tự). Bản ghi chuyển sang trạng thái xóa mềm (<code className="text-amber-300">deleted_at</code>, <code className="text-amber-300">deleted_by</code>, <code className="text-amber-300">delete_reason</code>) và được di chuyển vào Thùng Rác (Trash Can) 30 ngày.
                  </li>
                  <li className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                    <strong className="text-white block mb-1">2. Khôi phục từ Thùng Rác (Restore)</strong>
                    Cho phép khôi phục lại các từ vựng xóa mềm về CSDL active với điều kiện không bị trùng lặp khóa từ vựng hiện tại.
                  </li>
                  <li className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                    <strong className="text-white block mb-1">3. Xóa vĩnh viễn (Hard Delete) bởi Super Admin</strong>
                    Thao tác xóa vĩnh viễn chỉ dành riêng cho vai trò Super Admin với cảnh báo nguy hại và hộp thoại xác nhận thứ hai.
                  </li>
                  <li className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                    <strong className="text-white block mb-1">4. Nhật ký Audit Trail (Bất biến)</strong>
                    Mọi hành vi Tạo, Sửa, Xóa mềm, Khôi phục, Xóa vĩnh viễn, Nhập tệp hàng loạt đều được ghi vết vào log Audit với đầy đủ Actor, Role, Action, Object ID, Before Diff, After Diff và Lý do.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'ai' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700">
                <h3 className="text-lg font-bold text-pink-300 mb-3">
                  🤖 AI QUÉT TRANH & TRÍCH XUẤT NỘI DUNG (AI POSTER SCANNER)
                </h3>
                <p className="text-slate-300 mb-4">
                  Nghiệp vụ AI quét ảnh poster học liệu để tự động chuyển đổi thành dữ liệu thẻ từ vựng:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white mb-2">📷 Quản lý Tệp Ảnh Tranh</h4>
                    <p className="text-xs text-slate-400">
                      Cho phép tải tệp ảnh poster minh họa (.png, .jpg), chọn mẫu poster có sẵn hoặc dùng camera để quét tranh trực tiếp.
                    </p>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white mb-2">🔍 OCR & Gán Nhãn Đa Ngôn Ngữ</h4>
                    <p className="text-xs text-slate-400">
                      Nhận diện Bounding Box đối tượng trong tranh, trích xuất từ EN, đề xuất nghĩa VI, IPA, phiên âm cho bé và điểm tự tin (Confidence Score).
                    </p>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white mb-2">👁️ Kiểm Duyệt Thủ Công (Human-in-the-loop)</h4>
                    <p className="text-xs text-slate-400">
                      Người kiểm duyệt có quyền Chấp nhận (Accept), Chỉnh sửa (Edit) hoặc Từ chối (Reject) từng kết quả quét trước khi chính thức đưa vào kho dữ liệu.
                    </p>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white mb-2">📊 Quota & Cost Tracking</h4>
                    <p className="text-xs text-slate-400">
                      Theo dõi chi tiết số lượt quét AI, thời gian thực thi job, model version (Gemini Flash OCR) và lượng token tiêu thụ.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'audio' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700">
                <h3 className="text-lg font-bold text-cyan-300 mb-3">
                  🔊 ÂM THANH, PHÁT ÂM VÀ AUDIO EVENT TELEMETRY
                </h3>
                <ul className="space-y-3 text-xs">
                  <li className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                    <strong className="text-white text-sm block mb-1">1. Hướng dẫn đọc từng trang ("Nghe Hướng Dẫn")</strong>
                    Mỗi trang poster có nút "Nghe Hướng Dẫn Trang X" phát âm giọng đọc chuẩn giới thiệu các chủ đề và danh mục trong trang kèm bảng transcript lời thoại.
                  </li>
                  <li className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                    <strong className="text-white text-sm block mb-1">2. Nguyên tắc phát âm đơn lẻ (Single Active Audio)</strong>
                    Đảm bảo khi phát âm 1 từ vựng mới hoặc file bài học mới, hệ thống tự động ngắt ngay audio đang chạy trước đó, tránh hiện tượng lồng tiếng/chồng âm.
                  </li>
                  <li className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                    <strong className="text-white text-sm block mb-1">3. Thống kê sự kiện phát âm (Audio Telemetry)</strong>
                    Ghi nhận sự kiện <code className="text-cyan-300">AUDIO_STARTED</code> và <code className="text-cyan-300">AUDIO_COMPLETED</code> khi bé nghe đạt trên 80% thời lượng bài phát âm để tính tiến độ học.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'import' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700">
                <h3 className="text-lg font-bold text-teal-300 mb-3">
                  📦 QUY TRÌNH NHẬP DỮ LIỆU HÀNG LOẠT 8 BƯỚC (BATCH IMPORT WIZARD)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {[
                    { step: 'Bước 1', title: 'Chọn loại dữ liệu', desc: 'Chọn nạp Thẻ từ vựng, Trang poster hay Phân vùng chủ đề.' },
                    { step: 'Bước 2', title: 'Tải Tệp Mẫu', desc: 'Cung cấp tệp Excel (.xlsx), CSV, JSON mẫu chuẩn 12 trường.' },
                    { step: 'Bước 3', title: 'Tải tệp / Dán dữ liệu', desc: 'Tải tệp dữ liệu lên hệ thống hoặc dán văn bản trực tiếp.' },
                    { step: 'Bước 4', title: 'Xác minh Schema', desc: 'Kiểm tra khớp nối các trường dữ liệu bắt buộc (Word, Meaning, Level...).' },
                    { step: 'Bước 5', title: 'Chọn chế độ trùng lặp', desc: 'UPSERT (Cập nhật nếu trùng), CREATE_ONLY, UPDATE_ONLY, SKIP_DUPLICATE, MERGE.' },
                    { step: 'Bước 6', title: 'Dry-Run Kiểm Duyệt', desc: 'Chạy thử nghiệm kiểm tra tính hợp lệ từng dòng, báo cáo dòng lỗi/dòng trùng.' },
                    { step: 'Bước 7', title: 'Thực Thi Nạp Hàng Loạt', desc: 'Ghi dữ liệu nguyên tử vào CSDL với tiến trình (Progress Bar).' },
                    { step: 'Bước 8', title: 'Báo Cáo & Rollback Job', desc: 'Tải báo cáo kết quả và cung cấp nút Rollback hoàn tác theo Job ID.' },
                  ].map((s) => (
                    <div key={s.step} className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700/80">
                      <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold text-[10px] uppercase">{s.step}</span>
                      <h4 className="font-bold text-white text-sm mt-1">{s.title}</h4>
                      <p className="text-slate-400 mt-1">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'qa' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700">
                <h3 className="text-lg font-bold text-purple-300 mb-3">
                  🎯 CHECKLIST CHẤT LƯỢNG (QA METRICS) & PHÂN QUYỀN RBAC
                </h3>
                <div className="space-y-4">
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white mb-2">📊 7 Chỉ Số Hoàn Thiện Dữ Liệu</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                        <span className="text-slate-400 block">Thiếu Ảnh/Icon</span>
                        <strong className="text-amber-400">Tự động báo cáo</strong>
                      </div>
                      <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                        <span className="text-slate-400 block">Thiếu IPA</span>
                        <strong className="text-amber-400">Kiểm tra tự động</strong>
                      </div>
                      <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                        <span className="text-slate-400 block">Thiếu Phiên Âm Bé</span>
                        <strong className="text-amber-400">Bổ sung AI Auto</strong>
                      </div>
                      <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                        <span className="text-slate-400 block">Số Từ Trùng Lặp</span>
                        <strong className="text-red-400">Auto Deduplicate</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white mb-2">🛡️ Chế Độ Bé (Kid Mode) & Phân Quyền An Toàn</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Chế độ Bé (Kid Mode) ẩn hoàn toàn 100% các nút quản trị, nhập liệu, sửa/xóa và log hệ thống. Bé chỉ tương tác với giao diện học sinh động, âm thanh phát âm cute, thẻ lật flashcard và trò chơi nhận thưởng Ngôi Sao Bé Ngoan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-800/90 px-6 py-4 border-t border-slate-700 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Mã tài liệu: <span className="font-mono text-indigo-300 font-bold">CFP-BRD-IVB-002 v2.0</span> • ChronoFlow Premium Enterprise Infrastructure
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm transition"
          >
            Đóng Tài Liệu
          </button>
        </div>
      </div>
    </div>
  );
}
