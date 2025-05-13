// 📁 src/components/JournalHeader.jsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import CenteredToast from "../../components/CenteredToast";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function JournalHeader({ header, setHeader }) {
  const fiscalYears = [
    { id: 1, name: '2024' },
    { id: 2, name: '2025' }
  ];

  const [entries, setEntries] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editEntry, setEditEntry] = useState({ date: '', description: '', fiscalYearId: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setHeader({ ...header, [e.target.name]: e.target.value });

  const handleAdd = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (!header.date || !header.description || !header.fiscalYearId) return;
      setEntries(prev => [...prev, header]);
      setHeader({ date: '', description: '', fiscalYearId: '' });

      toast.custom(() => (
        <CenteredToast
          message="✅ تم إضافة سجل جديد"
          bgColor="bg-green-100"
          textColor="text-green-800"
          borderColor="border-green-400"
        />
      ));
      setIsLoading(false);
    }, 500);
  };

  const handleDelete = (index) => {
    setIsLoading(true);
    setTimeout(() => {
      setEntries(prev => prev.filter((_, i) => i !== index));
      if (editIndex === index) {
        setEditIndex(null);
        setEditEntry({ date: '', description: '', fiscalYearId: '' });
      }

      toast.custom(() => (
        <CenteredToast
          message="🗑️ تم حذف السجل"
          bgColor="bg-red-100"
          textColor="text-red-800"
          borderColor="border-red-400"
        />
      ));
      setIsLoading(false);
    }, 500);
  };

  const startEdit = (index) => {
    setIsLoading(true);
    setTimeout(() => {
      setEditIndex(index);
      setEditEntry(entries[index]);
      setIsLoading(false);
    }, 500);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      const updated = [...entries];
      updated[editIndex] = editEntry;
      setEntries(updated);
      setEditIndex(null);
      setEditEntry({ date: '', description: '', fiscalYearId: '' });

      toast.custom(() => (
        <CenteredToast
          message="✅ تم حفظ التعديلات بنجاح"
          bgColor="bg-blue-100"
          textColor="text-blue-800"
          borderColor="border-blue-400"
        />
      ));
      setIsLoading(false);
    }, 500);
  };

  const cancelEdit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setEditIndex(null);
      setEditEntry({ date: '', description: '', fiscalYearId: '' });
      setIsLoading(false);
    }, 500);
  };

  return (
    <section className="bg-white p-4 shadow rounded space-y-4">
      <h3 className="font-semibold mb-2">دليل دفتر اليومية</h3>
      {isLoading && <LoadingSpinner />}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm mb-1">التاريخ</label>
          <input
            type="date"
            name="date"
            value={header.date}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">الوصف</label>
          <input
            type="text"
            name="description"
            value={header.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="الوصف"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">السنة المالية</label>
          <select
            name="fiscalYearId"
            value={header.fiscalYearId}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">اختر السنة</option>
            {fiscalYears.map(y => (
              <option key={y.id} value={y.id}>{y.name}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-1">
  {editIndex === null ? (
    <button
      onClick={handleAdd}
      className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
    >
      إضافة
    </button>
  ) : (
    <div className="flex gap-2">
      <button
        onClick={handleSave}
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full"
      >
        حفظ
      </button>
      <button
        onClick={cancelEdit}
        className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 w-full"
      >
        إلغاء
      </button>
    </div>
  )}
</div>

      </div>

      {entries.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white mt-4">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border px-4 py-2">التاريخ</th>
                <th className="border px-4 py-2">الوصف</th>
                <th className="border px-4 py-2">السنة المالية</th>
                <th className="border px-4 py-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((ent, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50 text-center">
                  {editIndex === idx ? (
                    <>
                      <td className="border px-2 py-2">
                        <input
                          type="date"
                          name="date"
                          value={editEntry.date}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="border px-2 py-2">
                        <input
                          type="text"
                          name="description"
                          value={editEntry.description}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="border px-2 py-2">
                        <select
                          name="fiscalYearId"
                          value={editEntry.fiscalYearId}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full"
                        >
                          <option value="">اختر السنة</option>
                          {fiscalYears.map(y => (
                            <option key={y.id} value={y.id}>{y.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="border px-2 py-2 space-x-1">
                        <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                          حفظ
                        </button>
                        <button onClick={cancelEdit} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">
                          إلغاء
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border px-4 py-2">{ent.date}</td>
                      <td className="border px-4 py-2">{ent.description}</td>
                      <td className="border px-4 py-2">
                        {fiscalYears.find(y => y.id.toString() === ent.fiscalYearId)?.name}
                      </td>
                      <td className="border px-4 py-2 space-x-2">
                        <button onClick={() => startEdit(idx)} className="text-blue-600 hover:underline">تعديل</button>
                        <button onClick={() => handleDelete(idx)} className="text-red-600 hover:underline">حذف</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
