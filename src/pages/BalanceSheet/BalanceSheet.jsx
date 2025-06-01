import { useEffect, useState, useRef } from 'react';
import axios from "../../service/axios";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BalanceSheet = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const printRef = useRef(null); // المرجع للطباعة

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`balance-sheet/getBalanceSheet`, {
        params: startDate && endDate ? { startDate, endDate } : {}
      });
      setData(response.data);
    } catch (error) {
      console.error('حدث خطأ أثناء جلب البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // عنوان التقرير
    // pdf.setFont('Arial', 'bold');
    // pdf.setFontSize(18);
    // pdf.text('تقرير الميزانية العمومية', pdf.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

    // صورة التقرير
    pdf.addImage(imgData, 'PNG', 0, 25, pdfWidth, pdfHeight);
    pdf.save('تقرير-الميزانية-العمومية.pdf');
  };

  if (loading) return <div className="text-center mt-10">جاري التحميل...</div>;
  if (!data) return <div className="text-center mt-10">لا توجد بيانات.</div>;

  const { summary, breakdown } = data;

  const renderSection = (title, items, color = 'text-gray-800') => (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className={`text-lg font-semibold mb-2 ${color}`}>{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">لا توجد سجلات.</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between text-sm">
              <span>{item.name}</span>
              <span className="font-semibold">{item.balance.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📊 تقرير الميزانية العمومية</h1>
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          طباعة PDF
        </button>
      </div>

      {/* فلترة التواريخ */}
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          عرض
        </button>
      </div>

      {/* محتوى قابل للطباعة */}
      <div ref={printRef} className="bg-white p-4 rounded-xl">
        {/* ملخص الميزانية */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-100 rounded-xl p-4 text-blue-800">
            <h2 className="text-sm">الأصول</h2>
            <p className="text-lg font-bold">{summary.assets.toFixed(2)}</p>
          </div>
          <div className="bg-red-100 rounded-xl p-4 text-red-800">
            <h2 className="text-sm">الخصوم</h2>
            <p className="text-lg font-bold">{summary.liabilities.toFixed(2)}</p>
          </div>
          <div className="bg-green-100 rounded-xl p-4 text-green-800">
            <h2 className="text-sm">حقوق الملكية</h2>
            <p className="text-lg font-bold">{summary.equity.toFixed(2)}</p>
          </div>
          <div className="bg-yellow-100 rounded-xl p-4 text-yellow-800">
            <h2 className="text-sm">الإيرادات</h2>
            <p className="text-lg font-bold">{summary.revenue.toFixed(2)}</p>
          </div>
          <div className="bg-purple-100 rounded-xl p-4 text-purple-800">
            <h2 className="text-sm">المصروفات</h2>
            <p className="text-lg font-bold">{summary.expenses.toFixed(2)}</p>
          </div>
        </div>

        {/* تفاصيل الأقسام */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderSection('الأصول', breakdown.assets, 'text-blue-700')}
          {renderSection('الخصوم', breakdown.liabilities, 'text-red-700')}
          {renderSection('الإيرادات', breakdown.revenue, 'text-yellow-700')}
          {renderSection('المصروفات', breakdown.expenses, 'text-purple-700')}
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
