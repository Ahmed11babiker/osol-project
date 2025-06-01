import { useEffect, useState } from "react";
import axios from "../../service/axios";

const JournalEntries = () => {
  const [groupedData, setGroupedData] = useState({});
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({ description: "", debit: 0, credit: 0 });

  const fetchData = () => {
    axios.get(`jounral-entry/get-jounral`).then((res) => {
      const entries = res.data.data;
      const grouped = {};

      entries.forEach((entry) => {
        const journalId = entry.journalId;
        if (!grouped[journalId]) {
          grouped[journalId] = {
            journalInfo: entry.journalEntries,
            entries: [],
          };
        }
        grouped[journalId].entries.push(entry);
      });

      setGroupedData(grouped);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا القيد؟")) return;
    try {
      await axios.delete(`jounral-entry/delete/${id}`);
      fetchData(); // إعادة تحميل البيانات بعد الحذف
    } catch (err) {
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const handleEditClick = (entry) => {
    setEditingEntry(entry);
    setFormData({
      description: entry.description,
      debit: entry.debit,
      credit: entry.credit,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`jounral-entry/update/${editingEntry.id}`, {
        journalId: editingEntry.journalId,
        accountId: editingEntry.accountId,
        costCenterId: editingEntry.costCenterId,
        ...formData,
      });
      setEditingEntry(null);
      fetchData(); // إعادة تحميل البيانات بعد التعديل
    } catch (err) {
      alert("حدث خطأ أثناء التحديث");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">القيود اليومية</h2>

      {Object.values(groupedData).map(({ journalInfo, entries }) => (
        <div key={journalInfo.id} className="mb-6 border rounded p-4 shadow">
          <div className="mb-2 font-semibold">
            <span>تاريخ القيد:</span>{" "}
            {new Date(journalInfo.date).toLocaleDateString("ar-EG")}
          </div>
          <div className="mb-2 font-semibold">الوصف العام: {journalInfo.description}</div>
          <table className="w-full table-auto border mt-2">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">رمز الحساب</th>
                <th className="border px-2 py-1">اسم الحساب</th>
                <th className="border px-2 py-1">البيان</th>
                <th className="border px-2 py-1">مدين</th>
                <th className="border px-2 py-1">دائن</th>
                <th className="border px-2 py-1">مركز التكلفة</th>
                <th className="border px-2 py-1">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td className="border px-2 py-1 text-center">{e.account.code}</td>
                  <td className="border px-2 py-1">{e.account.name}</td>
                  <td className="border px-2 py-1">{e.description}</td>
                  <td className="border px-2 py-1 text-right">{e.debit.toFixed(2)}</td>
                  <td className="border px-2 py-1 text-right">{e.credit.toFixed(2)}</td>
                  <td className="border px-2 py-1">{e.costCenter?.name || "-"}</td>
                  <td className="border px-2 py-1 text-center space-x-2">
                    <button
                      onClick={() => handleEditClick(e)}
                      className="text-blue-600 hover:underline mx-2"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-red-600 hover:underline mx-2"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* نموذج التعديل */}
      {editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">تعديل القيد</h3>
            <label className="block mb-2">البيان:</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border w-full mb-2 px-2 py-1"
            />
            <label className="block mb-2">مدين:</label>
            <input
              type="number"
              value={formData.debit}
              onChange={(e) => setFormData({ ...formData, debit: parseFloat(e.target.value) })}
              className="border w-full mb-2 px-2 py-1"
            />
            <label className="block mb-2">دائن:</label>
            <input
              type="number"
              value={formData.credit}
              onChange={(e) => setFormData({ ...formData, credit: parseFloat(e.target.value) })}
              className="border w-full mb-4 px-2 py-1"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingEntry(null)}
                className="px-4 py-2 bg-gray-300 rounded mx-2"
              >
                إلغاء
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded mx-2"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntries;





