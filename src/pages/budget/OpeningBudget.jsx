import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import CenteredToast from "../../components/CenteredToast";

export default function OpeningBudget() {
  const API_BASE = "http://localhost:3001/api";

  const [fiscalYears, setFiscalYears] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [formData, setFormData] = useState({
    fiscalYearId: "",
    accountId: "",
    debit: "",
    credit: "",
    note: "",
  });

  useEffect(() => {
    fetchFiscalYears();
    fetchAccounts();
  }, []);

  const fetchFiscalYears = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/year/index`);
      if (res.data && Array.isArray(res.data.data)) {
        setFiscalYears(res.data.data);
      } else {
        setFiscalYears([]);
      }
    } catch (error) {
      console.error("خطأ في جلب السنوات المالية:", error);
      setToastMessage("حدث خطأ أثناء جلب السنوات المالية.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/account/index`);
      if (res.data && Array.isArray(res.data)) {
        setAccounts(res.data);
      } else {
        setAccounts([]);
      }
    } catch (error) {
      console.error("خطأ في جلب الحسابات:", error);
      setToastMessage("حدث خطأ أثناء جلب الحسابات.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_BASE}/opening-balance/create`, {
        fiscalYearId: formData.fiscalYearId,
        balance: [
          {
            accountId: formData.accountId,
            debit: parseFloat(formData.debit) || 0,
            credit: parseFloat(formData.credit) || 0,
            note: formData.note,
          },
        ],
      });

      setToastMessage("تمت إضافة الميزانية بنجاح.");
      setFormData({
        fiscalYearId: "",
        accountId: "",
        debit: "",
        credit: "",
        note: "",
      });
    } catch (error) {
      console.error("خطأ في إرسال الميزانية:", error);
      setToastMessage("حدث خطأ أثناء إضافة الميزانية.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
      {loading && <LoadingSpinner />}
      {toastMessage && (
        <CenteredToast message={toastMessage} onClose={() => setToastMessage("")} />
      )}

      <h2 className="text-xl font-bold mb-4">الميزانية الافتتاحية</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <select
          name="fiscalYearId"
          value={formData.fiscalYearId}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        >
          <option value="">اختر السنة المالية</option>
          {fiscalYears.map((year) => (
            <option key={year.id} value={year.id}>
              {year.year}
            </option>
          ))}
        </select>

        <select
          name="accountId"
          value={formData.accountId}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        >
          <option value="">اختر الحساب</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="debit"
          value={formData.debit}
          onChange={handleChange}
          placeholder="مدين"
          className="p-2 border rounded"
        />

        <input
          type="number"
          name="credit"
          value={formData.credit}
          onChange={handleChange}
          placeholder="دائن"
          className="p-2 border rounded"
        />

        <input
          type="text"
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="ملاحظات"
          className="p-2 border rounded col-span-full"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded col-span-full"
        >
          إضافة
        </button>
      </form>

      {/* جدول عرض الميزانيات لاحقًا */}
    </div>
  );
}
