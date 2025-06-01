import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  Repeat,
  CheckCircle,
  XCircle,
  CornerUpLeft,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dashboardItems = [
  { label: "الوكلاء", icon: Users, key: "agents" },
  { label: "الفواتير", icon: FileText, key: "invoices" },
  { label: "العمليات", icon: Repeat, key: "totalTransactions" },
  { label: "الفواتير المحصلة", icon: CheckCircle, key: "paid" },
  { label: "الفواتير غير المحصلة", icon: XCircle, key: "pending" },
  { label: "المرتجعة", icon: CornerUpLeft, key: "cancelled" },
];

export default function DashboardSection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/dashborad/dashborad")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error("Error fetching dashboard data:", err));
  }, []);

  if (!data) {
    return <div className="p-4">جاري تحميل البيانات...</div>;
  }

  const chartData = Object.entries(data.invoiceStatusCounts || {}).map(
    ([status, count]) => ({
      name:
        status === "paid"
          ? "محصلة"
          : status === "pending"
          ? "غير محصلة"
          : status === "cancelled"
          ? "ملغاة"
          : status === "under_review"
          ? "قيد المراجعة"
          : "غير معروف",
      value: count,
    })
  );

  return (
    <div className="p-4 space-y-6">
      {/* البطاقات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {dashboardItems.map((item, index) => {
          let value = 0;
          if (item.key === "invoices" || item.key === "totalTransactions") {
            value = data[item.key] ?? 0;
          } else if (data.invoiceStatusCounts) {
            value = data.invoiceStatusCounts[item.key] ?? 0;
          }

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center bg-white rounded shadow p-4 hover:bg-gray-100 cursor-pointer"
            >
              <item.icon className="w-10 h-10 text-blue-600 mb-2" />
              <span className="text-lg font-bold text-gray-900 mb-1">{value}</span>
              <span className="text-sm font-medium text-gray-800">{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* الرسم البياني */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-4">حالة الفواتير</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
