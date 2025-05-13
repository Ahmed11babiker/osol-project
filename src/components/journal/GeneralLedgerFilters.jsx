// 📁 src/components/journal/GeneralLedgerFilters.jsx
import { useState } from "react";

export default function GeneralLedgerFilters({ onApply }) {
  const [form, setForm] = useState({ account: "", startDate: "", endDate: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onApply(form); };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded grid grid-cols-1 md:grid-cols-4 gap-4">
      <select name="account" value={form.account} onChange={handleChange} className="border p-2 rounded">
        <option value="">اختر الحساب</option>
        <option value="cash">الصندوق</option>
        <option value="bank">البنك</option>
      </select>
      <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="border p-2 rounded" />
      <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="border p-2 rounded" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">تطبيق الفلتر</button>
    </form>
  );
}