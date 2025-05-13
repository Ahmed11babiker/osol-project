// 📁 src/components/AddFiscalYearForm.jsx
import { useState } from "react";

export default function AddFiscalYearForm({ onAddFiscalYear }) {
  const [yearName, setYearName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddFiscalYear({ yearName, startDate, endDate });
    setYearName("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow rounded">
      <h2 className="text-xl mb-4">إضافة سنة مالية جديدة</h2>
      <div>
        <label htmlFor="yearName" className="block mb-2">اسم السنة المالية</label>
        <input
          id="yearName"
          type="text"
          value={yearName}
          onChange={(e) => setYearName(e.target.value)}
          placeholder="مثل: 2025"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="startDate" className="block mb-2">تاريخ البدء</label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="endDate" className="block mb-2">تاريخ الانتهاء</label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          إضافة
        </button>
      </div>
    </form>
  );
}
