import { useState } from "react";
import { toast } from "react-hot-toast";

export default function FiscalYearForm() {
  const [yearName, setYearName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fiscalYears, setFiscalYears] = useState([]);

  const handleSave = () => {
    if (!yearName || !startDate || !endDate) {
      toast.error("❌ يرجى ملء جميع الحقول.");
      return;
    }

    const newFiscalYear = {
      id: Date.now(),
      yearName,
      startDate,
      endDate,
    };

    setFiscalYears([...fiscalYears, newFiscalYear]);
    toast.success("✅ تم حفظ السنة المالية بنجاح");

    // إعادة تعيين الحقول
    setYearName("");
    setStartDate("");
    setEndDate("");
  };

  const handleDelete = (id) => {
    setFiscalYears(fiscalYears.filter((fy) => fy.id !== id));
    toast.success("🗑️ تم حذف السنة المالية");
  };

  const handleEdit = (fy) => {
    setYearName(fy.yearName);
    setStartDate(fy.startDate);
    setEndDate(fy.endDate);
    setFiscalYears(fiscalYears.filter((item) => item.id !== fy.id));
    toast("✏️ يمكنك تعديل البيانات الآن");
  };

  return (
    <div className="bg-white p-6 shadow rounded  w-full space-y-6">
      <h2 className="text-xl font-bold mb-4">إضافة سنة مالية جديدة</h2>

      <div>
        <label htmlFor="yearName" className="block mb-2">اسم السنة المالية</label>
        <input
          type="text"
          id="yearName"
          value={yearName}
          onChange={(e) => setYearName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="startDate" className="block mb-2">تاريخ البداية</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="endDate" className="block mb-2">تاريخ النهاية</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          حفظ
        </button>
        <button
          onClick={() => {
            setYearName("");
            setStartDate("");
            setEndDate("");
            toast("❌ تم إلغاء العملية");
          }}
          className="bg-gray-500 text-white py-2 px-4 rounded"
        >
          إلغاء
        </button>
      </div>

      {fiscalYears.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">السنوات المالية المضافة:</h3>
          <ul className="space-y-4">
            {fiscalYears.map((fy) => (
              <li
                key={fy.id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p><strong>السنة:</strong> {fy.yearName}</p>
                  <p><strong>من:</strong> {fy.startDate}</p>
                  <p><strong>إلى:</strong> {fy.endDate}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(fy)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(fy.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded"
                  >
                    حذف
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
