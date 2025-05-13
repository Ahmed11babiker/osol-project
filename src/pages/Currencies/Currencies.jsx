// 📄 src/pages/Currencies.jsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import CenteredToast from "../../components/CenteredToast";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Currencies() {
  const [currencies, setCurrencies] = useState([
    { name: "الدولار الأمريكي", code: "USD", symbol: "$", rate: 1.0 },
    { name: "اليورو", code: "EUR", symbol: "€", rate: 0.92 }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", symbol: "", rate: "" });
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddOrUpdateCurrency = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (!form.name || !form.code || !form.symbol || !form.rate) {
        toast.custom(() => (
          <CenteredToast
            message="⚠️ الرجاء ملء جميع الحقول"
            bgColor="bg-yellow-100"
            textColor="text-yellow-800"
            borderColor="border-yellow-400"
          />
        ));
        setIsLoading(false);
        return;
      }

      if (editIndex !== null) {
        const updated = [...currencies];
        updated[editIndex] = { ...form, rate: parseFloat(form.rate) };
        setCurrencies(updated);
        toast.custom(() => <CenteredToast message="✅ تم تحديث العملة بنجاح" />);
      } else {
        setCurrencies([...currencies, { ...form, rate: parseFloat(form.rate) }]);
        toast.custom(() => <CenteredToast message="✅ تم إضافة العملة بنجاح" />);
      }

      setForm({ name: "", code: "", symbol: "", rate: "" });
      setEditIndex(null);
      setIsLoading(false);
    }, 500);
  };

  const handleEdit = (index) => {
    const currency = currencies[index];
    setForm(currency);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setIsLoading(true);
    setTimeout(() => {
      const updated = [...currencies];
      updated.splice(index, 1);
      setCurrencies(updated);
      toast.custom(() => <CenteredToast message="🗑️ تم حذف العملة" />);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">💱 العملات</h2>
      {isLoading && <LoadingSpinner />}

      {/* نموذج إضافة أو تعديل */}
      <form
        onSubmit={handleAddOrUpdateCurrency}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded shadow"
      >
        <input
          type="text"
          name="name"
          placeholder="اسم العملة"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="code"
          placeholder="الكود"
          value={form.code}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="symbol"
          placeholder="رمز العملة"
          value={form.symbol}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="rate"
          placeholder="المعدل"
          step="0.01"
          value={form.rate}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* زر إضافة / تحديث + إلغاء */}
        <div className="col-span-full md:col-span-1 flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editIndex !== null ? "تحديث" : "إضافة"}
          </button>
          {editIndex !== null && (
            <button
              type="button"
              onClick={() => {
                setForm({ name: "", code: "", symbol: "", rate: "" });
                setEditIndex(null);
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>

      {/* جدول العملات */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-right rtl text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">اسم العملة</th>
              <th className="p-2">الكود</th>
              <th className="p-2">الرمز</th>
              <th className="p-2">المعدل</th>
              <th className="p-2">العمليات</th>
            </tr>
          </thead>
          <tbody>
            {currencies.map((currency, index) => (
              <tr key={index} className="border-b odd:bg-white even:bg-gray-50">
                <td className="p-2">{currency.name}</td>
                <td className="p-2">{currency.code}</td>
                <td className="p-2">{currency.symbol}</td>
                <td className="p-2">{currency.rate}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-600 hover:underline"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:underline"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
