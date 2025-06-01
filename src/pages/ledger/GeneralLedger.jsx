import React, { useState, useEffect } from "react";
import axios from "../../service/axios";
import { toast } from "react-hot-toast";

export default function GeneralLedger() {
  const [filter, setFilter] = useState({ account: "", startDate: "", endDate: "" });
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // دالة لجلب البيانات مع قبول فلاتر اختيارية
  const fetchEntries = async (params = {}) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`trial-balance/getGeneralLedger`, {
        params,
      });

      if (res.data && res.data.data) {
        setEntries(res.data.data);
      } else {
        setEntries([]);
        toast.error("لا توجد بيانات.");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  // عند تحميل الصفحة، جلب البيانات بدون فلتر
  useEffect(() => {
    fetchEntries();
  }, []);

  // تغيير قيم الفلتر عند الإدخال
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // جلب البيانات حسب الفلتر بعد التحقق (يمكن السماح بحقل الحساب فارغ)
  const handleFilter = () => {
    // نسمح بأن يكون حساب فارغ لكن نتحقق من التاريخ فقط
    if ((filter.startDate && !filter.endDate) || (!filter.startDate && filter.endDate)) {
      toast.error("يرجى إدخال تاريخ بداية ونهاية معاً");
      return;
    }

    // إعداد معلمات الاستعلام
    const params = {};
    if (filter.account) params.accountId = filter.account;
    if (filter.startDate) params.startDate = filter.startDate;
    if (filter.endDate) params.endDate = filter.endDate;

    fetchEntries(params);
  };

  const totalDebit = entries.reduce((sum, e) => sum + (e.debit || 0), 0);
  const totalCredit = entries.reduce((sum, e) => sum + (e.credit || 0), 0);

  return (
    <div className="p-4 space-y-4">
      {/* فلاتر البحث */}
      <div className="bg-white rounded shadow p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block mb-1 font-medium">الحساب</label>
          <input
            type="text"
            name="account"
            value={filter.account}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            placeholder="رقم الحساب أو معرفه"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">من تاريخ</label>
          <input
            type="date"
            name="startDate"
            value={filter.startDate}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">إلى تاريخ</label>
          <input
            type="date"
            name="endDate"
            value={filter.endDate}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleFilter}
            className="bg-blue-600 text-white rounded px-4 py-2 w-full hover:bg-blue-700"
          >
            عرض التقرير
          </button>
        </div>
      </div>

      {/* ملخص القيم */}
      {entries.length > 0 && (
        <div className="bg-gray-100 p-4 rounded shadow flex justify-between text-center">
          <div>
            <p className="text-gray-500">إجمالي المدين</p>
            <p className="text-xl font-bold text-green-600">{totalDebit.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500">إجمالي الدائن</p>
            <p className="text-xl font-bold text-red-600">{totalCredit.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500">الرصيد النهائي</p>
            <p className="text-xl font-bold text-blue-600">{(totalDebit - totalCredit).toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* جدول النتائج */}
      <div className="overflow-auto rounded shadow">
        {isLoading ? (
          <div className="text-center py-10">جاري التحميل...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-10 text-gray-500">لا توجد بيانات لعرضها</div>
        ) : (
          <table className="min-w-full text-sm text-right border">
            <thead className="bg-blue-50 text-gray-700 font-bold">
              <tr>
                <th className="border px-2 py-2">التاريخ</th>
                <th className="border px-2 py-2">الوصف</th>
                <th className="border px-2 py-2">مدين</th>
                <th className="border px-2 py-2">دائن</th>
                <th className="border px-2 py-2">الرصيد</th>
                <th className="border px-2 py-2">اسم الحساب</th>
                <th className="border px-2 py-2">كود الحساب</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-2 py-1">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="border px-2 py-1">{entry.description}</td>
                  <td className="border px-2 py-1 text-green-700">{entry.debit?.toFixed(2)}</td>
                  <td className="border px-2 py-1 text-red-700">{entry.credit?.toFixed(2)}</td>
                  <td className="border px-2 py-1 text-blue-700">{entry.balance?.toFixed(2)}</td>
                  <td className="border px-2 py-1">{entry.accountName}</td>
                  <td className="border px-2 py-1">{entry.accountCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
