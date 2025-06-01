import { useEffect, useState } from "react";
import axios from "../../service/axios";

export default function CloseBudget() {
  const [budgets, setBudgets] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const fetchBudgets = async () => {
      setLoading(true);
      try {
        const res = await axios.get("opening-balance/index");
        setBudgets(res.data);
      } catch (error) {
        console.error("فشل في جلب البيانات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const handleClose = async () => {
    if (!selectedId) return;

    const confirmClose = window.confirm("هل أنت متأكد من إغلاق هذه الميزانية؟");
    if (!confirmClose) return;

    try {
      setClosing(true);
      const res = await axios.get(`/opening-balance/${selectedId}/close`);

      if (!res.status === 200) throw new Error("فشل الإغلاق");

      // تحديث حالة الميزانية محليًا
      setBudgets((prev) =>
        prev.map((b) =>
          b.id === parseInt(selectedId) ? { ...b, status: "مغلقة" } : b
        )
      );
      setSelectedId("");
      alert("تم إغلاق الميزانية بنجاح.");
    } catch (err) {
      console.error("خطأ أثناء الإغلاق:", err);
      alert("حدث خطأ أثناء إغلاق الميزانية.");
    } finally {
      setClosing(false);
    }
  };

  const openBudgets = budgets.filter((b) => b.status === "مفتوحة");

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6">إغلاق الميزانية الافتتاحية</h2>

      {loading ? (
        <p className="text-center text-gray-500">جاري تحميل الميزانيات...</p>
      ) : openBudgets.length > 0 ? (
        <>
          <div className="mb-4">
            <label className="block mb-2 font-medium">اختر السنة المالية:</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="">-- اختر السنة --</option>
              {openBudgets.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.year}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleClose}
            disabled={!selectedId || closing}
            className={`w-full py-2 rounded text-white ${
              selectedId && !closing
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {closing ? "جاري الإغلاق..." : "إغلاق الميزانية"}
          </button>
        </>
      ) : (
        <p className="text-center text-gray-500">لا توجد ميزانيات مفتوحة حاليًا</p>
      )}
    </div>
  );
}
