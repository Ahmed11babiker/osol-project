// 📁 src/pages/Jourrnal/BalanceSheet.jsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import CenteredToast from "../../components/CenteredToast";
import LoadingSpinner from "../../components/LoadingSpinner";
export default function BalanceSheet() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // بيانات الميزانية مع تواريخ
  const [balanceSheet] = useState({
    assets: [
      { name: "النقد", amount: 5000, date: "2025-01-10" },
      { name: "الحسابات المدينة", amount: 3000, date: "2025-04-01" },
    ],
    liabilities: [
      { name: "الدائنون", amount: 2000, date: "2025-02-05" },
      { name: "قرض قصير الأجل", amount: 1000, date: "2025-03-20" },
    ],
    equity: [
      { name: "رأس المال", amount: 4000, date: "2025-01-01" },
      { name: "الأرباح المتراكمة", amount: 1000, date: "2025-04-10" },
    ],
  });

  // تصفية البيانات حسب التاريخ
  const filterByDate = (items) => {

    return items.filter(item => {
      const itemDate = new Date(item.date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      return (
        (!from || itemDate >= from) &&
        (!to || itemDate <= to)
      );
    });
  };

  const filteredAssets = filterByDate(balanceSheet.assets);
  const filteredLiabilities = filterByDate(balanceSheet.liabilities);
  const filteredEquity = filterByDate(balanceSheet.equity);

  const total = (list) => list.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalAssets = total(filteredAssets);
  const totalLiabilities = total(filteredLiabilities);
  const totalEquity = total(filteredEquity);

  const handlePrint = () => {
    setIsLoading(true)
    setTimeout(() => {
      if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      toast.custom(() => (
        <CenteredToast
          message="⚠️ تأكد من صحة نطاق التواريخ"
          bgColor="bg-yellow-100"
          textColor="text-yellow-800"
          borderColor="border-yellow-400"
        />
      ));
      setIsLoading(false)
      return;
    }
    toast.custom(() => (
      <CenteredToast
        message="🖨️ جاري تحضير الطباعة"
      />
    ));
    window.print();
    setIsLoading(false)
    }, 500);
    
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">الميزانية العمومية</h2>
      {isLoading && <LoadingSpinner/>}
      {/* اختيار الفترة */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">من تاريخ:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">إلى تاريخ:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 self-end print:hidden"
        >
          🖨️ طباعة الميزانية
        </button>
      </div>

      {/* عرض البيانات المفلترة */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">الأصول</h3>
        <ul className="space-y-2">
          {filteredAssets.map((item, index) => (
            <li key={index} className="flex justify-between bg-gray-50 p-2 rounded">
              <span>{item.name}</span>
              <span>{item.amount.toLocaleString()} ريال</span>
            </li>
          ))}
        </ul>
        <div className="text-end font-bold mt-2">الإجمالي: {totalAssets.toLocaleString()} ريال</div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">الخصوم</h3>
        <ul className="space-y-2">
          {filteredLiabilities.map((item, index) => (
            <li key={index} className="flex justify-between bg-gray-50 p-2 rounded">
              <span>{item.name}</span>
              <span>{item.amount.toLocaleString()} ريال</span>
            </li>
          ))}
        </ul>
        <div className="text-end font-bold mt-2">الإجمالي: {totalLiabilities.toLocaleString()} ريال</div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">حقوق الملكية</h3>
        <ul className="space-y-2">
          {filteredEquity.map((item, index) => (
            <li key={index} className="flex justify-between bg-gray-50 p-2 rounded">
              <span>{item.name}</span>
              <span>{item.amount.toLocaleString()} ريال</span>
            </li>
          ))}
        </ul>
        <div className="text-end font-bold mt-2">الإجمالي: {totalEquity.toLocaleString()} ريال</div>
      </div>

      <div className="text-center font-bold text-lg mt-4 text-blue-700">
        {totalAssets === totalLiabilities + totalEquity
          ? "✅ الميزانية متوازنة"
          : "❌ الميزانية غير متوازنة"}
      </div>
    </div>
  );
}
