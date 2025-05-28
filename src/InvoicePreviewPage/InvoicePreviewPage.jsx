// src/pages/InvoicePreviewPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const InvoicePreviewPage = () => {
  const { id } = useParams(); // نحصل على id الفاتورة من الرابط
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/invoice/${id}`)
      .then((res) => setInvoice(res.data))
      .catch(console.error);
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!invoice) return <div className="text-center mt-10">جاري تحميل الفاتورة...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow mt-6 print:p-0 print:shadow-none print:bg-white">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-2xl font-bold">معاينة الفاتورة</h2>
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          طباعة الفاتورة
        </button>
      </div>

      <div className="border p-4 rounded text-right">
        <h3 className="text-xl font-semibold mb-2">فاتورة رقم #{invoice.id}</h3>
        <p><strong>اسم العميل:</strong> {invoice.customerName}</p>
        <p><strong>التاريخ:</strong> {invoice.date}</p>
        <p><strong>المبلغ الإجمالي:</strong> {invoice.totalAmount} ريال</p>
        <hr className="my-4" />
        <h4 className="font-semibold mb-2">تفاصيل العناصر:</h4>
        <ul className="list-disc pr-6 space-y-1">
          {invoice.items?.map((item, idx) => (
            <li key={idx}>
              {item.description} - {item.amount} ريال
            </li>
          ))}
        </ul>
        <hr className="my-4" />
        {invoice.paymentMethods?.length > 0 && (
          <>
            <h4 className="font-semibold mb-2">طرق الدفع:</h4>
            <ul className="list-disc pr-6 space-y-1">
              {invoice.paymentMethods.map((pm, idx) => (
                <li key={idx}>
                  {pm.method} - {pm.payment?.amount} ريال - المرجع: {pm.payment?.reference}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default InvoicePreviewPage;
