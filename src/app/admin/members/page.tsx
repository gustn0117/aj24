"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/admin/Modal";
import { Member } from "@/lib/types";

const emptyMember = { name: "", email: "", phone: "", address: "", status: "active" as "active" | "inactive" | "banned", memo: "" };

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState(emptyMember);

  const fetchMembers = useCallback(async () => { const res = await fetch(`/api/admin/members?page=${page}`); const data = await res.json(); setMembers(data.data || []); setTotal(data.total || 0); }, [page]);
  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const openCreate = () => { setEditing(null); setForm(emptyMember); setModalOpen(true); };
  const openEdit = (m: Member) => { setEditing(m); setForm({ name: m.name, email: m.email, phone: m.phone || "", address: m.address || "", status: m.status, memo: m.memo || "" }); setModalOpen(true); };
  const handleSave = async () => { const method = editing ? "PUT" : "POST"; const url = editing ? `/api/admin/members/${editing.id}` : "/api/admin/members"; await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); setModalOpen(false); fetchMembers(); };
  const handleDelete = async (id: number) => { if (!confirm("정말 삭제하시겠습니까?")) return; await fetch(`/api/admin/members/${id}`, { method: "DELETE" }); fetchMembers(); };

  const statusStyle: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    inactive: "bg-gray-50 text-gray-500 border-gray-200",
    banned: "bg-red-50 text-red-700 border-red-200",
  };
  const statusLabel: Record<string, string> = { active: "활성", inactive: "비활성", banned: "차단" };
  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10 transition-all bg-white";
  const labelCls = "block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">전체 <span className="font-semibold text-gray-900">{total}</span>명 회원</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition-all active:scale-95">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          회원 추가
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">이름</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">이메일</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">전화번호</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">가입일</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3.5 text-gray-400 font-mono text-xs">#{m.id}</td>
                <td className="px-4 py-3.5 font-medium text-gray-900">{m.name}</td>
                <td className="px-4 py-3.5 text-gray-500">{m.email}</td>
                <td className="px-4 py-3.5 text-gray-500">{m.phone || "-"}</td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusStyle[m.status]}`}>
                    {statusLabel[m.status]}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center text-gray-400 text-xs">{new Date(m.created_at).toLocaleDateString("ko-KR")}</td>
                <td className="px-4 py-3.5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => openEdit(m)} className="px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">수정</button>
                    <button onClick={() => handleDelete(m.id)} className="px-2 py-1 text-[11px] font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors">삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {members.length === 0 && <div className="text-center py-16"><p className="text-gray-400 text-sm">회원이 없습니다.</p></div>}
      </div>

      {total > 20 && (
        <div className="flex justify-center gap-1">
          {Array.from({ length: Math.ceil(total / 20) }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${page === i + 1 ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}>{i + 1}</button>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "회원 수정" : "회원 추가"}>
        <div className="space-y-4">
          <div><label className={labelCls}>이름</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
          <div><label className={labelCls}>이메일</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} /></div>
          <div><label className={labelCls}>전화번호</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} /></div>
          <div><label className={labelCls}>주소</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} /></div>
          <div>
            <label className={labelCls}>상태</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "inactive" | "banned" })} className={inputCls}>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="banned">차단</option>
            </select>
          </div>
          <div><label className={labelCls}>메모</label><textarea value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} rows={2} className={`${inputCls} resize-none`} /></div>
          <button onClick={handleSave} className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-all active:scale-[0.98]">{editing ? "수정하기" : "추가하기"}</button>
        </div>
      </Modal>
    </div>
  );
}
