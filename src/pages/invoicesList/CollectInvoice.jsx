// 📁 src/pages/CollectInvoice.jsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import CenteredToast from "../../components/CenteredToast";
import LoadingSpinner from "../../components/LoadingSpinner";
export default function CollectInvoice() {
  const [invoices, setInvoices] = useState([]);
  const [formData, setFormData] = useState({
    number: "",
    date: "",
    amount: "",
    notes: ""
  });
  const [editIndex, setEditIndex] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true)
    setTimeout(() => {
      if (editIndex !== null) {
      const updated = [...invoices];
      updated[editIndex] = formData;
      setInvoices(updated);
      setEditIndex(null);
      toast.custom(() => (
        <CenteredToast
          message="✏️ تم تحديث الفاتورة بنجاح"
          bgColor="bg-yellow-100"
          textColor="text-yellow-800"
          borderColor="border-yellow-400"
        />
      ));
    } else {
      setInvoices([...invoices, formData]);
      toast.custom(() => (
        <CenteredToast
          message="✅ تم تحصيل الفاتورة بنجاح"
        />
      ));
    }
    setFormData({ number: "", date: "", amount: "", notes: "" });
    setIsLoading(false)
    }, 500);
  };

  const handleDelete = (index) => {
    setIsLoading(true)
    setTimeout(() => {
       const updated = invoices.filter((_, i) => i !== index);
    setInvoices(updated);
    toast.custom(() => (
      <CenteredToast
        message="🗑️ تم حذف الفاتورة"
        bgColor="bg-red-100"
        textColor="text-red-800"
        borderColor="border-red-400"
      />
    ));
    setIsLoading(false)
    }, 500);
   
  };

  const handleEdit = (index) => {
    setIsLoading(true)
    setTimeout(() => {
       setFormData(invoices[index]);
    setEditIndex(index);
    toast.custom(() => (
      <CenteredToast
        message="✏️ يمكنك تعديل الفاتورة الآن"
        bgColor="bg-blue-100"
        textColor="text-blue-800"
        borderColor="border-blue-400"
      />
    ));
    setIsLoading(false)   
    }, 500);
   
  };

  const handlePrint = (invoice) => {
    setIsLoading(true)
    setTimeout(() => {
      if (!invoice) return;
    toast.custom(() => (
      <CenteredToast
        message="🖨️ جاري التحضير للطباعة"
      />
    ));
    const content = `
      <div style="font-family: Arial; direction: rtl; padding: 20px;">
        <h2>فاتورة محصلة</h2>
        <p><strong>رقم الفاتورة:</strong> ${invoice.number}</p>
        <p><strong>تاريخ التحصيل:</strong> ${invoice.date}</p>
        <p><strong>المبلغ:</strong> ${invoice.amount}</p>
        <p><strong>ملاحظات:</strong> ${invoice.notes || "لا توجد"}</p>
      </div>
    `;
    const win = window.open("", "PrintWindow", "width=600,height=600");
    win.document.write(content);
    win.document.close();
    win.print();
    setIsLoading(false)
    }, 500);
    
    
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">تحصيل فاتورة</h2>
      {isLoading && <LoadingSpinner/>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <input
            name="number"
            value={formData.number}
            onChange={handleChange}
            placeholder="رقم الفاتورة"
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="المبلغ"
            className="border p-2 rounded"
            required
          />
          <input
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="ملاحظات"
            className="border p-2 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          {editIndex !== null ? "تحديث الفاتورة" : "تحصيل الفاتورة"}
        </button>
      </form>

      {invoices.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">الفواتير المحصلة</h3>
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">رقم الفاتورة</th>
                <th className="border px-4 py-2">تاريخ التحصيل</th>
                <th className="border px-4 py-2">المبلغ</th>
                <th className="border px-4 py-2">ملاحظات</th>
                <th className="border px-4 py-2">الخيارات</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{inv.number}</td>
                  <td className="border px-4 py-2">{inv.date}</td>
                  <td className="border px-4 py-2">{inv.amount}</td>
                  <td className="border px-4 py-2">{inv.notes}</td>
                  <td className="border px-4 py-2 space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      حذف
                    </button>
                    <button
                      onClick={() => handlePrint(inv)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      طباعة
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
