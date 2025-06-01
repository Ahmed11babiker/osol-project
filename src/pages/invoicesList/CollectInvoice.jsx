
import React, { useEffect, useState, useRef } from "react";
import axios from "../../service/axios";
import { motion, AnimatePresence } from "framer-motion";

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

  const modalRef = useRef();

  const paymentMethods = ["نقدًا", "تحويل بنكي", "شيك", "بطاقة ائتمان"];
  const descriptions = [
    "دفعة لفاتورة الحج",
    "دفعة لفاتورة العمرة",
    "دفعة لفاتورة تذكرة طيران",
  ];

  useEffect(() => {
    // جلب الفواتير
    axios.get(`invoice/index`)
    
      .then((res) => setInvoices( res.data) )
      
      
      .catch(console.error);

    // جلب الحسابات
    axios.get(`account/index`)
      .then((res) => setAccounts(res.data))
      .catch(console.error);

    // جلب السنوات المالية
    axios.get(`year/index`)
      .then((res) => setFiscalYears(res.data.data))
      .catch(console.error);
  }, []);

  // الحصول على المراجع الفريدة من طرق الدفع في الفواتير
  const references = Array.from(
    new Set(
      invoices.flatMap((invoice) =>
        invoice.paymentMethods?.map((pm) => pm.payment?.reference).filter(Boolean)
      )
    )
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCollect = async () => {
    try {
      // تأكد أن المسار صحيح collect وليس collct
      const res = await axios.post(`invoice/collect`, formData);
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
    const invoice = invoices.find((inv) => inv.id === parseInt(formData.invoiceId));
    setSelectedInvoice(invoice);
    setShowPreview(true);
  };

  const handlePrint = () => {
    if (modalRef.current) {
      const title = modalRef.current.querySelector("h3")?.outerHTML || "";
      const table = modalRef.current.querySelector("table")?.outerHTML || "";
      const printWindow = window.open("", "", "width=800,height=600");
      printWindow.document.write(`
        <html>
          <head>
            <title>فاتورة</title>
            <style>
              body { font-family: Arial; direction: rtl; text-align: right; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ccc; padding: 8px; }
              th { background-color: #f0f0f0; }
            </style>
          </head>
          <body>
            ${title}
            ${table}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const closeModal = () => {
    setShowPreview(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow relative">
      <h2 className="text-xl font-semibold mb-4 text-center">تحصيل فاتورة</h2>

      <div className="space-y-4">
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

        {formData.invoiceId && (
          <button
            onClick={handlePreview}
            className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600"
          >
            معاينة الفاتورة
          </button>
        )}

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

        <button
          onClick={handleCollect}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          تنفيذ التحصيل
        </button>

        {message && <div className="mt-4 text-center text-green-600">{message}</div>}
      </div>

      {/* ✅ Modal - Preview Invoice */}
      <AnimatePresence>
        {showPreview && selectedInvoice && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              ref={modalRef}
            >
              <button
                className="absolute top-2 left-2 text-red-600 hover:text-red-800 text-xl font-bold"
                onClick={closeModal}
              >
                &times;
              </button>
              <h3 className="text-lg font-bold text-center mb-4">معاينة الفاتورة</h3>

              <table className="w-full border border-gray-300 text-sm">
                <tbody>
                  <tr>
                    <th className="bg-gray-100 border p-2">رقم الفاتورة</th>
                    <td className="border p-2">{selectedInvoice.id}</td>
                  </tr>
                  <tr>
                    <th className="bg-gray-100 border p-2">اسم العميل</th>
                    <td className="border p-2">{selectedInvoice.customerName}</td>
                  </tr>
                  <tr>
                    <th className="bg-gray-100 border p-2">تاريخ الفاتورة</th>
                    <td className="border p-2">
                      {new Date(selectedInvoice.date).toLocaleDateString("ar-EG")}
                    </td>
                  </tr>
                  <tr>
                    <th className="bg-gray-100 border p-2">طريقة الدفع</th>
                    <td className="border p-2">
                      {selectedInvoice.paymentMethods?.[0]?.payment?.method || "---"}
                    </td>
                  </tr>
                  <tr>
                    <th className="bg-gray-100 border p-2">رقم المرجع</th>
                    <td className="border p-2">
                      {selectedInvoice.paymentMethods?.[0]?.payment?.reference || "---"}
                    </td>
                  </tr>
                  <tr>
                    <th className="bg-gray-100 border p-2">الوصف</th>
                    <td className="border p-2">
                      {selectedInvoice.paymentMethods?.[0]?.payment?.description || "---"}
                    </td>
                  </tr>
                  <tr>
                    <th className="bg-gray-100 border p-2">المبلغ الإجمالي</th>
                    <td className="border p-2">{selectedInvoice.totalAmount} ريال</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4 text-center">
                <button
                  onClick={handlePrint}
                  className="bg-green-600 text-white py-1 px-4 rounded hover:bg-green-700"
                >
                  طباعة
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectInvoicePage;
