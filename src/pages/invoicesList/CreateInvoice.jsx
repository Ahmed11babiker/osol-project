// 📁 src/pages/CreateInvoice.jsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import CenteredToast from "../../components/CenteredToast";
import LoadingSpinner from "../../components/LoadingSpinner";
export default function CreateInvoice() {
  const [invoice, setInvoice] = useState({
    customer: "",
    date: new Date().toISOString().split("T")[0],
    items: [{ description: "", quantity: 1, price: 0 }],
  });
  const [isLoading, setIsLoading] = useState(false);


  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[index][field] = field === "description" ? value : parseFloat(value);
    setInvoice({ ...invoice, items: updatedItems });
  };

  const addItem = () => {
    setIsLoading(true)
    setTimeout(() => {
      setInvoice({
      ...invoice,
      items: [...invoice.items, { description: "", quantity: 1, price: 0 }],
    });
    toast.custom(() => (
      <CenteredToast
        message="✅ تمت إضافة عنصر جديد"
        bgColor="bg-green-100"
        textColor="text-green-800"
        borderColor="border-green-400"
      />
    ));
    setIsLoading(false)
    }, 500);
    
  };

  const removeItem = (index) => {
    setIsLoading(true)
    setTimeout(() => {
       const updatedItems = invoice.items.filter((_, i) => i !== index);
    setInvoice({ ...invoice, items: updatedItems });
    toast.custom(() => (
      <CenteredToast
        message="🗑️ تم حذف العنصر"
        bgColor="bg-red-100"
        textColor="text-red-800"
        borderColor="border-red-400"
      />
    ));
    setIsLoading(false)
    }, 500);
   
  };

  const total = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handlePrint = () => {
    setIsLoading(true)
    setTimeout(() => {
      if (invoice.items.length === 0) {
      toast.custom(() => (
        <CenteredToast
          message="🚫 لا يمكن طباعة فاتورة فارغة"
          bgColor="bg-yellow-100"
          textColor="text-yellow-800"
          borderColor="border-yellow-400"
        />
      ));
      return;
    }
    toast.custom(() => (
      <CenteredToast
        message="🖨️ جاري التحضير للطباعة"
      />
    ));
    window.print();
    setIsLoading(false)
    }, 500);
    
  };

  const handleSave = () => {
    setIsLoading(true)
    setTimeout(() => {
       toast.custom(() => (
      <CenteredToast
        message="💾 تم حفظ الفاتورة بنجاح"
        bgColor="bg-blue-100"
        textColor="text-blue-800"
        borderColor="border-blue-400"
      />
    ));
    setIsLoading(false)
    }, 500);
   
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">إنشاء فاتورة</h2>
       {isLoading && <LoadingSpinner/>}
      <div className="bg-white p-6 rounded shadow space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            value={invoice.customer}
            onChange={(e) => setInvoice({ ...invoice, customer: e.target.value })}
            placeholder="اسم العميل"
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={invoice.date}
            onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
            className="border p-2 rounded"
          />
        </div>

        <table className="w-full mt-4 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">الوصف</th>
              <th className="p-2 border">الكمية</th>
              <th className="p-2 border">السعر</th>
              <th className="p-2 border">الإجمالي</th>
              <th className="p-2 border">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    className="w-full border rounded p-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    className="w-full border rounded p-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={item.price}
                    min="0"
                    onChange={(e) => handleItemChange(index, "price", e.target.value)}
                    className="w-full border rounded p-1"
                  />
                </td>
                <td className="border p-2 text-center">
                  {(item.quantity * item.price).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:underline"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addItem}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          إضافة عنصر
        </button>

        <div className="text-right font-bold text-lg mt-4">
          الإجمالي: {total.toLocaleString(undefined, { minimumFractionDigits: 2 })} ريال
        </div>

        <div className="flex gap-4 justify-end">
          <button
            onClick={handleSave}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            حفظ الفاتورة
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            طباعة الفاتورة
          </button>
        </div>
      </div>
    </div>
  );
}
