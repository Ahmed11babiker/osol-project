import { useEffect, useState } from "react";
import axios from "axios";

export default function FinancialYearClose() {
  const API_BASE = "http://localhost:3001/api/year";

  const [years, setYears] = useState([]);
  const [oldYearId, setOldYearId] = useState("");
  const [newYearId, setNewYearId] = useState("");

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await axios.get(`${API_BASE}/index`);
        setYears(res.data.data); // نفترض { data: [...] }
      } catch (err) {
        console.error("فشل في تحميل السنوات:", err);
      }
    };
    fetchYears();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oldYearId || !newYearId) {
      alert("يرجى اختيار السنتين المالية");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/close`, {
        oldFiscalYearId: oldYearId,
        newFiscalYearId: newYearId,
      });
      alert("✅ تم إغلاق السنة المالية بنجاح");
      console.log(res.data);
    } catch (err) {
      console.error("❌ فشل الإغلاق:", err.response?.data || err.message);
      alert("حدث خطأ أثناء الإغلاق");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">إغلاق السنة المالية</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">السنة المالية (القديمة):</label>
          <select
            className="w-full border px-4 py-2 rounded"
            value={oldYearId}
            onChange={(e) => setOldYearId(e.target.value)}
          >
            <option value="">-- اختر السنة القديمة --</option>
            {years.map((y) => (
              <option key={y.id} value={y.id}>
                {new Date(y.startDate).getFullYear()}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">السنة المالية (الجديدة):</label>
          <select
            className="w-full border px-4 py-2 rounded"
            value={newYearId}
            onChange={(e) => setNewYearId(e.target.value)}
          >
            <option value="">-- اختر السنة الجديدة --</option>
            {years.map((y) => (
              <option key={y.id} value={y.id}>
                {new Date(y.startDate).getFullYear()}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!oldYearId || !newYearId}
          className={`w-full py-2 text-white rounded ${
            oldYearId && newYearId
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          إغلاق السنة المالية
        </button>
      </form>
    </div>
  );
}
