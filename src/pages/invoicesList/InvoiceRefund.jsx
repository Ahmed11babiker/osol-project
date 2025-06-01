import { useEffect, useState } from "react";
import axios from "../../service/axios";

export default function InvoiceRefund() {
  const [formData, setFormData] = useState({
    invoiceId: "",
    fiscalYearId: "",
    debitAccountId: "",
    creditAccountId: "",
  });

  const [invoices, setInvoices] = useState([]);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const fetchData = async () => {
    try {
      const [invoiceRes, fiscalRes, accountRes] = await Promise.all([
        axios.get("/invoice/index"),
        axios.get("/year/index"),
        axios.get("/account/index"),
      ]);

      // تصفية الفواتير المدفوعة فقط
      const paidInvoices = invoiceRes.data.filter(inv => inv.status === "paid");

      setInvoices(paidInvoices);
      setFiscalYears(fiscalRes.data.data);
      setAccounts(accountRes.data);
    } catch (err) {
      console.error("خطأ في تحميل البيانات:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/invoice/return", formData);
      alert("تم إنشاء مرتجع الفاتورة بنجاح!");
      setFormData({ invoiceId: "", fiscalYearId: "", debitAccountId: "", creditAccountId: "" });
    } catch (err) {
      console.error("خطأ أثناء إرسال المرتجع:", err.message);
      alert("حدث خطأ أثناء إرسال المرتجع!");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">إنشاء مرتجع فاتورة</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* اختيار الفاتورة */}
        <div>
          <label htmlFor="invoiceId" className="block mb-1 font-semibold">اختر الفاتورة</label>
          <select
            id="invoiceId"
            name="invoiceId"
            value={formData.invoiceId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- اختر فاتورة --</option>
            {invoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                #{inv.id} - {inv.customerName} - {inv.totalAmount} جنيه سوداني
              </option>
            ))}
          </select>
        </div>

        {/* السنة المالية */}
        <div>
          <label htmlFor="fiscalYearId" className="block mb-1 font-semibold">السنة المالية</label>
          <select
            id="fiscalYearId"
            name="fiscalYearId"
            value={formData.fiscalYearId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- اختر السنة المالية --</option>
            {fiscalYears.map((year) => (
              <option key={year.id} value={year.id}>{year.year}</option>
            ))}
          </select>
        </div>

        {/* الحساب المدين */}
        <div>
          <label htmlFor="debitAccountId" className="block mb-1 font-semibold">الحساب المدين</label>
          <select
            id="debitAccountId"
            name="debitAccountId"
            value={formData.debitAccountId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- اختر الحساب المدين --</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
        </div>

        {/* الحساب الدائن */}
        <div>
          <label htmlFor="creditAccountId" className="block mb-1 font-semibold">الحساب الدائن</label>
          <select
            id="creditAccountId"
            name="creditAccountId"
            value={formData.creditAccountId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- اختر الحساب الدائن --</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          حفظ المرتجع
        </button>
      </form>
    </div>
  );
}
