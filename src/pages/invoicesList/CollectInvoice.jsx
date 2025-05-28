// src/pages/CollectInvoicePage.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const CollectInvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [formData, setFormData] = useState({
    invoiceId: "",
    method: "",
    reference: "",
    description: "",
    debitAccountId: "",
    creditAccountId: "",
    fiscalYearId: "",
  });
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const previewRef = useRef();

  const paymentMethods = ["نقدًا", "تحويل بنكي", "شيك", "بطاقة ائتمان"];
  const descriptions = [
    "دفعة لفاتورة الحج",
    "دفعة لفاتورة العمرة",
    "دفعة لفاتورة تذكرة طيران",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/invoice/index")
      .then((res) => setInvoices(res.data))
      .catch(console.error);

    axios
      .get("http://localhost:3001/api/account/index")
      .then((res) => setAccounts(res.data))
      .catch(console.error);

    axios
      .get("http://localhost:3001/api/year/index")
      .then((res) => setFiscalYears(res.data.data))
      .catch(console.error);
  }, []);

  const references = Array.from(
    new Set(
      invoices.flatMap((invoice) =>
        invoice.paymentMethods
          ?.map((pm) => pm.payment?.reference)
          .filter(Boolean)
      )
    )
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCollect = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/invoice/collct",
        formData
      );
      setMessage(res.data.message);
      setFormData({
        invoiceId: "",
        method: "",
        reference: "",
        description: "",
        debitAccountId: "",
        creditAccountId: "",
        fiscalYearId: "",
      });
      setShowPreview(false);
      setSelectedInvoice(null);
    } catch (error) {
      setMessage(error.response?.data?.message || "حدث خطأ أثناء التحصيل");
    }
  };

  const handlePreview = () => {
    const invoice = invoices.find(
      (inv) => inv.id === parseInt(formData.invoiceId)
    );
    setSelectedInvoice(invoice);
    setShowPreview(true);
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // تأخير بسيط لضمان ظهور العنصر
  };

  const handlePrint = () => {
    if (previewRef.current) {
      const printContent = previewRef.current.innerHTML;
      const printWindow = window.open("", "", "width=800,height=600");
      printWindow.document.write(
        `<html><head><title>فاتورة</title></head><body dir="rtl">${printContent}</body></html>`
      );
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">تحصيل فاتورة</h2>

      <div className="space-y-4">
        {/* اختيار الفاتورة */}
        <select
          name="invoiceId"
          value={formData.invoiceId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">اختر الفاتورة</option>
          {invoices.map((inv) => (
            <option key={inv.id} value={inv.id}>
              {`فاتورة #${inv.id} - ${inv.customerName} - ${inv.totalAmount} ريال`}
            </option>
          ))}
        </select>

        {/* زر معاينة الفاتورة */}
        {formData.invoiceId && (
          <button
            onClick={handlePreview}
            className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600"
          >
            معاينة الفاتورة
          </button>
        )}

        {/* طريقة الدفع */}
        <select
          name="method"
          value={formData.method}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">اختر طريقة الدفع</option>
          {paymentMethods.map((method, idx) => (
            <option key={idx} value={method}>
              {method}
            </option>
          ))}
        </select>

        {/* رقم المرجع */}
        <select
          name="reference"
          value={formData.reference}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">اختر رقم المرجع</option>
          {references.map((ref, index) => (
            <option key={index} value={ref}>
              {ref}
            </option>
          ))}
        </select>

        {/* وصف العملية */}
        <select
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">اختر وصف التحصيل</option>
          {descriptions.map((desc, index) => (
            <option key={index} value={desc}>
              {desc}
            </option>
          ))}
        </select>

        {/* الحساب المدين */}
        <select
          name="debitAccountId"
          value={formData.debitAccountId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">اختر الحساب المدين</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>

        {/* الحساب الدائن */}
        <select
          name="creditAccountId"
          value={formData.creditAccountId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">اختر الحساب الدائن</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>

        {/* السنة المالية */}
        <select
          name="fiscalYearId"
          value={formData.fiscalYearId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">اختر السنة المالية</option>
          {fiscalYears.map((fy) => (
            <option key={fy.id} value={fy.id}>
              {fy.year}
            </option>
          ))}
        </select>

        {/* زر تنفيذ التحصيل */}
        <button
          onClick={handleCollect}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          تنفيذ التحصيل
        </button>

        {message && (
          <div className="mt-4 text-center text-green-600">{message}</div>
        )}

        {/* كرت المعاينة */}
        {showPreview && selectedInvoice && (
          <div
            className="border p-4 rounded shadow mt-6 bg-gray-50 relative"
            ref={previewRef}
          >
            {/* زر الإغلاق */}
            <button
              className="absolute top-2 left-2 text-red-600 hover:text-red-800 text-xl font-bold"
              onClick={() => setShowPreview(false)}
              aria-label="إغلاق"
            >
              &times;
            </button>

            <h3 className="text-lg font-bold mb-2 text-center">
              معاينة الفاتورة
            </h3>
            <p>
              <strong>رقم الفاتورة:</strong> {selectedInvoice.id}
            </p>
            <p>
              <strong>اسم العميل:</strong> {selectedInvoice.customerName}
            </p>
            <p>
              <strong>المبلغ الإجمالي:</strong> {selectedInvoice.totalAmount}{" "}
              ريال
            </p>
            <p>
              <strong>الوصف:</strong>{" "}
              {selectedInvoice.paymentMethods?.[0]?.payment?.description ||
                "---"}
            </p>
            <p>
              <strong>طريقة الدفع:</strong>{" "}
              {selectedInvoice.paymentMethods?.[0]?.payment?.method || "---"}
            </p>
            <p>
              <strong>رقم المرجع:</strong>{" "}
              {selectedInvoice.paymentMethods?.[0]?.payment?.reference || "---"}
            </p>

            <div className="mt-4 text-center">
              <button
                onClick={handlePrint}
                className="bg-green-600 text-white py-1 px-4 rounded hover:bg-green-700"
              >
                طباعة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectInvoicePage;
