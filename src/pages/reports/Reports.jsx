// 📄 src/pages/Reports.jsx
import { useState, useRef } from "react";
import ReportFilters from "../../components/ReportFilters";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import html2pdf from "html2pdf.js";
import LoadingSpinner from "../../components/LoadingSpinner";
import * as XLSX from "xlsx";
import { useReactToPrint } from "react-to-print";

export default function Reports() {
  const [filters, setFilters] = useState(null);
  const reportRef = useRef();

  const handleApplyFilters = (newFilters) => {
    setIsLoading(true)
    setTimeout(() => {
        setFilters(newFilters);
        setIsLoading(false)
    }, 500);
  
  };

  const data = [
    { month: "يناير", revenue: 4000 },
    { month: "فبراير", revenue: 3000 },
    { month: "مارس", revenue: 5000 },
    { month: "أبريل", revenue: 4000 },
    { month: "مايو", revenue: 7000 },
  ];
  const [isLoading, setIsLoading] = useState(false);

  const handleExportPDF = () => {
    const element = reportRef.current;
    setIsLoading(true);
    setTimeout(() => {
      html2pdf()
        .set({
          margin: 0.5,
          filename: "report.pdf",
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
      setIsLoading(false);
    }, 500);
  };


  const exportExcel = () => {
    setIsLoading(true)
    setTimeout(() => {
          const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "report.xlsx");
    setIsLoading(false)
    }, 500);
  };

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: "تقرير الإيرادات",
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">📊 التقارير</h2>
      {isLoading && <LoadingSpinner />}
      <ReportFilters onApplyFilters={handleApplyFilters} />

      <div ref={reportRef} className="bg-white p-6 shadow rounded">
        <h3 className="text-xl font-semibold mb-4">📄 التقرير الناتج</h3>

        {filters ? (
          <div className="mb-4 text-gray-700">
            <p>
              الفترة: من {filters.dateRange.startDate} إلى{" "}
              {filters.dateRange.endDate}
            </p>
            <p>الفرع: {filters.branch}</p>
            <p>المركز: {filters.center}</p>
          </div>
        ) : (
          <p className="text-gray-500 mb-4">
            يرجى تطبيق الفلاتر لعرض التقارير.
          </p>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            📈 الإيرادات الشهرية (مخطط خطي)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#1E40AF"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleExportPDF}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
        >
          🧾 تصدير PDF
        </button>
        <button
          onClick={exportExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          📊 تصدير Excel
        </button>
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          🖨️ طباعة التقرير
        </button>
      </div>
    </div>
  );
}
