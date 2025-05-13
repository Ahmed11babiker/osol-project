// ✅ Dashboard.jsx - لوحة التحكم الرئيسية

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area
} from 'recharts';

const sampleLineData = [
  { month: 'يناير', revenue: 5000, expense: 3000 },
  { month: 'فبراير', revenue: 7000, expense: 4000 },
  { month: 'مارس', revenue: 6000, expense: 3500 },
  { month: 'أبريل', revenue: 8000, expense: 4500 }
];

const samplePieData = [
  { name: 'مصروفات', value: 4000 },
  { name: 'إيرادات', value: 8000 }
];

const COLORS = ['#FF8042', '#00C49F'];

export default function Dashboard({ lang }) {
  const [data, setData] = useState(sampleLineData);
  const [pieData, setPieData] = useState(samplePieData);

  // حساب الأرباح والخسائر
  const profitLossData = data.map(item => ({
    month: item.month,
    profit: item.revenue - item.expense,
    revenue: item.revenue,
    expense: item.expense
  }));

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">
        {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
      </h1>

      {/* ✔ إيرادات ومصروفات & نسبة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">
            {lang === 'ar' ? 'الإيرادات مقابل المصروفات' : 'Revenue vs Expenses'}
          </h2>
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
                stroke="#00C49F"
                name={lang === 'ar' ? 'إيرادات' : 'Revenue'}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#FF8042"
                name={lang === 'ar' ? 'مصروفات' : 'Expense'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">
            {lang === 'ar'
              ? 'نسبة الإيرادات والمصروفات'
              : 'Revenue & Expense Ratio'}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✔ مخطط الأرباح فقط */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-2">
          {lang === 'ar' ? 'الأرباح لكل شهر' : 'Monthly Profit'}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={profitLossData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="profit" fill="#16a34a" name={lang === 'ar' ? 'أرباح' : 'Profit'} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ✔ مقارنة الأرباح والخسائر */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-2">
          {lang === 'ar' ? 'مقارنة الأرباح والمصروفات' : 'Profit vs Expenses'}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={profitLossData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="profit" fill="#16a34a" name={lang === 'ar' ? 'أرباح' : 'Profit'} />
            <Bar dataKey="expense" fill="#dc2626" name={lang === 'ar' ? 'مصروفات' : 'Expenses'} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
