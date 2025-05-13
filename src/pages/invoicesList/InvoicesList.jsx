// 📁 src/pages/InvoicesList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function InvoicesList() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    // تحميل الفواتير من الذاكرة (أو API)
    const storedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(storedInvoices);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">قائمة الفواتير</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">اسم العميل</th>
            <th className="border px-4 py-2">المبلغ الإجمالي</th>
            <th className="border px-4 py-2">حالة الدفع</th>
            <th className="border px-4 py-2">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{invoice.clientName}</td>
              <td className="border px-4 py-2">{invoice.totalAmount} ريال</td>
              <td className="border px-4 py-2">{invoice.status}</td>
              <td className="border px-4 py-2">
                <Link to={`/invoices/${invoice.id}`} className="text-blue-500">
                  عرض التفاصيل
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
