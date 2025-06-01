import { useEffect, useState } from "react";
import axios from "../service/axios";
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
  const [profitData, setProfitData] = useState(null);

  useEffect(() => {
    // بيانات لوحة التحكم
    axios
      .get("dashborad/dashborad")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching dashboard data:", err));

    // بيانات الأرباح والخسائر
    axios
      .get("profit-loss/getProfitAndLoss")
      .then((res) => setProfitData(res.data.data))
      .catch((err) =>
        console.error("Error fetching profit and loss data:", err)
      );
  }, []);

  if (!data) {
    return <div className="p-4">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
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

      {/* رسم بياني لتقرير الأرباح */}
      {profitData && (
        <div className="bg-white p-4 rounded shadow col-span-1 sm:col-span-2 md:col-span-3">
          <h2 className="text-xl font-bold mb-4 text-gray-800">تقرير الأرباح</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: "الإيرادات", value: profitData.revenue },
                { name: "المصروفات", value: profitData.expense },
                { name: "صافي الربح", value: profitData.netProfit },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
