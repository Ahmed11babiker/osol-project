// 📁 src/components/ReportFilters.jsx
import { useState } from "react";

export default function ReportFilters({ onApplyFilters }) {
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [branch, setBranch] = useState("");
  const [center, setCenter] = useState("");

  const handleApplyFilters = () => {
    onApplyFilters({ dateRange, branch, center });
  };

  return (
    <div className="bg-white p-6 shadow rounded mb-4">
      <h3 className="text-lg font-semibold mb-4">الفلاتر</h3>

      <div className="mb-4">
        <label htmlFor="startDate" className="block mb-2">تاريخ البداية</label>
        <input
          type="date"
          id="startDate"
          value={dateRange.startDate}
          onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="endDate" className="block mb-2">تاريخ النهاية</label>
        <input
          type="date"
          id="endDate"
          value={dateRange.endDate}
          onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="branch" className="block mb-2">الفرع</label>
        <input
          type="text"
          id="branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="center" className="block mb-2">المركز</label>
        <input
          type="text"
          id="center"
          value={center}
          onChange={(e) => setCenter(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleApplyFilters}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          تطبيق الفلاتر
        </button>
      </div>
    </div>
  );
}
