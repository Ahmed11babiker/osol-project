// 📁 src/pages/Journal.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import CenteredToast from "../../components/CenteredToast";

export default function Journal() {
  const API_BASE = "http://localhost:3001/api";

  const [entries, setEntries] = useState([]);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [entryData, setEntryData] = useState({
    date: "",
    description: "",
    fiscalYearId: "",
    type: "",
    details: [{ accountId: "", debit: "", credit: "", description: "" }],
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchEntries(), fetchFiscalYears(), fetchAccounts()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${API_BASE}/jounral/index`);
      setEntries(res.data);
    } catch (err) {
      console.error("فشل في جلب القيود:", err);
      setToastMessage("فشل في جلب القيود.");
    }
  };

  const fetchFiscalYears = async () => {
    try {
      const res = await axios.get(`${API_BASE}/year/index`);
      setFiscalYears(res.data.data);
    } catch (err) {
      console.error("فشل في جلب السنوات المالية:", err);
      setToastMessage("فشل في جلب السنوات المالية.");
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/account/index`);
      // adjust if your API returns data under res.data.data
      setAccounts(Array.isArray(res.data) ? res.data : res.data.data);
    } catch (err) {
      console.error("فشل في جلب الحسابات:", err);
      setToastMessage("فشل في جلب الحسابات.");
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-CA");
  const formatTime = (iso) => new Date(iso).toLocaleTimeString("en-GB");

  const handleChange = (field, value) =>
    setEntryData((d) => ({ ...d, [field]: value }));

  const handleDetailChange = (i, field, value) => {
    const upd = [...entryData.details];
    upd[i][field] = value;
    setEntryData((d) => ({ ...d, details: upd }));
  };

  const addDetailRow = () =>
    setEntryData((d) => ({
      ...d,
      details: [...d.details, { accountId: "", debit: "", credit: "", description: "" }],
    }));

  const removeDetailRow = (i) => {
    const upd = [...entryData.details];
    upd.splice(i, 1);
    setEntryData((d) => ({ ...d, details: upd }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        date: entryData.date,
        description: entryData.description,
        fiscalYearId: parseInt(entryData.fiscalYearId),
        type: entryData.type,
        entries: entryData.details.map((d) => ({
          accountId: parseInt(d.accountId),
          description: d.description,
          debit: parseFloat(d.debit || 0),
          credit: parseFloat(d.credit || 0),
        })),
      };
      await axios.post(`${API_BASE}/jounral/create`, payload);
      setToastMessage("تم حفظ القيد بنجاح.");
      fetchEntries();
      setEntryData({
        date: "",
        description: "",
        fiscalYearId: "",
        type: "",
        details: [{ accountId: "", debit: "", credite: "", description: "" }],
      });
    } catch (err) {
      console.error("فشل في حفظ القيد:", err);
      setToastMessage("فشل في حفظ القيد.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`هل أنت متأكد من حذف القيد رقم ${id}?`)) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/jounral/delete/${id}`);
      setToastMessage("تم حذف القيد.");
      fetchEntries();
    } catch (err) {
      console.error("فشل في حذف القيد:", err);
      setToastMessage("فشل في حذف القيد.");
    } finally {
      setLoading(false);
    }
  };

  const getYearName = (id) => fiscalYears.find((y) => y.id === id)?.year || "";
  const getAccountName = (id) => accounts.find((a) => a.id === id)?.name || "";

  return (
    <div className="max-w-7xl mx-auto p-6 relative">
      {loading && <LoadingSpinner />}
      {toastMessage && (
        <CenteredToast message={toastMessage} onClose={() => setToastMessage("")} />
      )}

      <h2 className="text-2xl font-bold mb-6 text-blue-800">القيود اليومية</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow mb-8">
        {/* Header Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block mb-1">السنة المالية</label>
            <select
              value={entryData.fiscalYearId}
              onChange={(e) => handleChange("fiscalYearId", e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">اختر السنة</option>
              {fiscalYears.map((y) => (
                <option key={y.id} value={y.id}>{y.year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">نوع القيد</label>
            <select
              value={entryData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">اختر النوع</option>
              <option value="عادي">عادي</option>
              <option value="افتتاحي">افتتاحي</option>
              <option value="تسوية">تسوية</option>
              <option value="إقفال">إقفال</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">تاريخ القيد</label>
            <input
              type="date"
              value={entryData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">الوصف العام</label>
            <input
              type="text"
              value={entryData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
        </div>

        {/* Detail Rows */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">تفاصيل القيد</h3>
          {entryData.details.map((row, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 items-center">
              <select
                value={row.accountId}
                onChange={(e) => handleDetailChange(i, "accountId", e.target.value)}
                className="border rounded p-2"
                required
              >
                <option value="">اختر الحساب</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="مدين"
                value={row.debit}
                onChange={(e) => handleDetailChange(i, "debit", e.target.value)}
                className="border rounded p-2"
              />
              <input
                type="number"
                placeholder="دائن"
                value={row.credit}
                onChange={(e) => handleDetailChange(i, "credit", e.target.value)}
                className="border rounded p-2"
              />
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="الوصف"
                  value={row.description}
                  onChange={(e) => handleDetailChange(i, "description", e.target.value)}
                  className="border rounded p-2 w-full"
                />
                {entryData.details.length > 1 && (
                  <button type="button" onClick={() => removeDetailRow(i)} className="text-red-500 font-bold">×</button>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={addDetailRow} className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">
            + إضافة بند
          </button>
        </div>

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-4">
          حفظ القيد
        </button>
      </form>

      {/* Entries Table */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">القيود المدخلة</h3>
        {entries.length === 0 ? (
          <p className="text-gray-500">لا توجد قيود بعد.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="border-b pb-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <strong>قيد #{entry.id}</strong> – {formatDate(entry.date)}{" "}
                  {formatTime(entry.date)} ({entry.type || "–"})
                </div>
                <button onClick={() => handleDelete(entry.id)} className="text-red-600 font-bold">
                  حذف
                </button>
              </div>
              <div className="mb-2 text-gray-700">{entry.description}</div>
              <table className="w-full text-right border border-gray-300 mb-2">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">الحساب</th>
                    <th className="p-2 border">مدين</th>
                    <th className="p-2 border">دائن</th>
                    <th className="p-2 border">الوصف</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(entry.JournalEntryDetails) &&
                    entry.JournalEntryDetails.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2 border">{getAccountName(row.accountId)}</td>
                        <td className="p-2 border">{row.debit}</td>
                        <td className="p-2 border">{row.credit}</td>
                        <td className="p-2 border">{row.description}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
