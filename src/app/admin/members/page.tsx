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

  const fetchMembers = useCallback(async () => {
    const res = await fetch(`/api/admin/members?page=${page}`);
    const data = await res.json();
    setMembers(data.data || []);
    setTotal(data.total || 0);
  }, [page]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyMember);
    setModalOpen(true);
  };

  const openEdit = (m: Member) => {
    setEditing(m);
    setForm({ name: m.name, email: m.email, phone: m.phone || "", address: m.address || "", status: m.status, memo: m.memo || "" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/admin/members/${editing.id}` : "/api/admin/members";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setModalOpen(false);
    fetchMembers();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/members/${id}`, { method: "DELETE" });
    fetchMembers();
  };

  const statusColor: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-600",
    banned: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">회원 관리</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          + 회원 추가
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">이름</th>
              <th className="px-4 py-3 text-left">이메일</th>
              <th className="px-4 py-3 text-left">전화번호</th>
              <th className="px-4 py-3 text-center">상태</th>
              <th className="px-4 py-3 text-center">가입일</th>
              <th className="px-4 py-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{m.id}</td>
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3 text-gray-500">{m.email}</td>
                <td className="px-4 py-3 text-gray-500">{m.phone || "-"}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-xs ${statusColor[m.status]}`}>{m.status}</span>
                </td>
                <td className="px-4 py-3 text-center text-gray-400 text-xs">
                  {new Date(m.created_at).toLocaleDateString("ko-KR")}
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => openEdit(m)} className="text-blue-600 hover:underline mr-3">수정</button>
                  <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:underline">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && <p className="text-center py-8 text-gray-400">회원이 없습니다.</p>}
      </div>

      {total > 20 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(total / 20) }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded text-sm ${page === i + 1 ? "bg-gray-900 text-white" : "bg-white border"}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "회원 수정" : "회원 추가"}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">이름</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">이메일</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">전화번호</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">주소</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">상태</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "inactive" | "banned" })}
              className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="banned">차단</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">메모</label>
            <textarea value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })}
              rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <button onClick={handleSave} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            {editing ? "수정" : "추가"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
