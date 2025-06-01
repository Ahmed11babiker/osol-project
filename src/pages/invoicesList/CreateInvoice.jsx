import { useEffect, useState } from "react";
import axios from "../../service/axios";

export default function Invoices() {
  const [form, setForm] = useState({
    customerName: "",
    totalAmount: "",
    invoiceType: "",
    description: "",
    itemDescription: "",
    itemQuantity: "",
    itemUnitPrice: "",
    paymentAmount: "",
    paymentMethod: "",
    paymentReference: "",
    paymentDescription: "",
  });

  const [invoices, setInvoices] = useState([]);
  const [editingStatusId, setEditingStatusId] = useState(null); // تتبع حالة التعديل
  const [newStatus, setNewStatus] = useState(""); // الحالة الجديدة المؤقتة


  const invoiceTypes = ["نقدية", "آجل", "أقساط"];
  const paymentMethods = ["نقدي", "تحويل بنكي", "بطاقة ائتمان"];
  const referenceOptions = ["REF001", "REF002", "REF003"];
  const itemDescriptions = ["سلعة A", "خدمة B", "سلعة C"];
  const descriptionOptions = ["فاتورة بيع", "فاتورة صيانة", "فاتورة استشارة"];
  const paymentDescriptions = ["دفعة أولى", "تحصيل كامل", "سداد جزئي"];
  const statusOptions = ["pending", "paid", "cancelled", "refunded"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      customerName: form.customerName,
      totalAmount: parseFloat(form.totalAmount),
      invoiceType: form.invoiceType,
      description: form.description,
      items: [
        {
          description: form.itemDescription,
          quantity: parseInt(form.itemQuantity),
          unitPrice: parseFloat(form.itemUnitPrice),
        },
      ],
      payment: {
        amount: parseFloat(form.paymentAmount),
        method: form.paymentMethod,
        reference: form.paymentReference,
        description: form.paymentDescription,
      },
    };

    try {
      await axios.post(`invoice/create`, payload);
      fetchInvoices();
      setForm({
        customerName: "",
        totalAmount: "",
        invoiceType: "",
        description: "",
        itemDescription: "",
        itemQuantity: "",
        itemUnitPrice: "",
        paymentAmount: "",
        paymentMethod: "",
        paymentReference: "",
        paymentDescription: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`invoice/index`);
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(`invoice/cancel`, { invoiceId: id });
      fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`invoice/${id}`);
      fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEdit = (id, currentStatus) => {
    setEditingStatusId(id);
    setNewStatus(currentStatus);
  };

  const handleSaveStatus = async (id) => {
    try {
      await axios.put(`invoice/update`, {
        invoiceId: id,
        status: newStatus,
      });
      setEditingStatusId(null);
      fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingStatusId(null);
    setNewStatus("");
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">إنشاء فاتورة جديدة</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
        <input className="border p-2 rounded" name="customerName" placeholder="اسم العميل" value={form.customerName} onChange={handleChange} />
        <input className="border p-2 rounded" name="totalAmount" placeholder="المبلغ الإجمالي" value={form.totalAmount} onChange={handleChange} />
        <select className="border p-2 rounded" name="invoiceType" value={form.invoiceType} onChange={handleChange}>
          <option value="">نوع الفاتورة</option>
          {invoiceTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select className="border p-2 rounded" name="description" value={form.description} onChange={handleChange}>
          <option value="">الوصف</option>
          {descriptionOptions.map((desc) => (
            <option key={desc} value={desc}>{desc}</option>
          ))}
        </select>
        <input className="border p-2 rounded" name="itemDescription" placeholder="وصف العنصر" value={form.itemDescription} onChange={handleChange} />
        <input className="border p-2 rounded" name="itemQuantity" placeholder="الكمية" value={form.itemQuantity} onChange={handleChange} />
        <input className="border p-2 rounded" name="itemUnitPrice" placeholder="سعر الوحدة" value={form.itemUnitPrice} onChange={handleChange} />
        <input className="border p-2 rounded" name="paymentAmount" placeholder="قيمة الدفع" value={form.paymentAmount} onChange={handleChange} />
        <select className="border p-2 rounded" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
          <option value="">طريقة الدفع</option>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
        <select className="border p-2 rounded" name="paymentReference" value={form.paymentReference} onChange={handleChange}>
          <option value="">المرجع</option>
          {referenceOptions.map((ref) => (
            <option key={ref} value={ref}>{ref}</option>
          ))}
        </select>
        <select className="border p-2 rounded" name="paymentDescription" value={form.paymentDescription} onChange={handleChange}>
          <option value="">وصف الدفع</option>
          {paymentDescriptions.map((desc) => (
            <option key={desc} value={desc}>{desc}</option>
          ))}
        </select>
        <button className="col-span-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" type="submit">حفظ الفاتورة</button>
      </form>

      <h2 className="text-2xl font-bold mt-8 mb-4">قائمة الفواتير</h2>
      <table className="w-full border text-center bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">اسم العميل</th>
            <th className="p-2">المبلغ</th>
            <th className="p-2">النوع</th>
            <th className="p-2">الوصف</th>
            <th className="p-2">الحالة</th>
            <th className="p-2">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv, index) => (
            <tr key={inv.id} className="border-t">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{inv.customerName}</td>
              <td className="p-2">{inv.totalAmount}</td>
              <td className="p-2">{inv.invoiceType}</td>
              <td className="p-2">{inv.description}</td>
              <td className="p-2">
                {editingStatusId === inv.id ? (
                  <div className="flex items-center gap-2">
                    <select className="border p-1 rounded" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <button className="text-green-600 hover:underline" onClick={() => handleSaveStatus(inv.id)}>حفظ</button>
                    <button className="text-red-600 hover:underline" onClick={handleCancelEdit}>إلغاء</button>
                  </div>
                ) : (
                  <span>{inv.status}</span>
                )}
              </td>
              <td className="p-2 space-x-2 rtl:space-x-reverse">
                <button className="text-yellow-600 hover:underline" onClick={() => handleStartEdit(inv.id, inv.status)}>تعديل الحالة</button>
                <button className="text-blue-600 hover:underline" onClick={() => handleCancel(inv.id)}>إلغاء</button>
                <button className="text-red-600 hover:underline" onClick={() => handleDelete(inv.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
