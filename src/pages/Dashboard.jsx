import {
  Users,
  FileText,
  Repeat,
  CheckCircle,
  XCircle,
  CornerUpLeft,
} from "lucide-react";

const dashboardItems = [
  { label: "الوكلاء", icon: Users },
  { label: "الفواتير", icon: FileText },
  { label: "العمليات", icon: Repeat },
  { label: "الفواتير المحصلة", icon: CheckCircle },
  { label: "الفواتير غير المحصلة", icon: XCircle },
  { label: "المرتجعة", icon: CornerUpLeft },
];

export default function DashboardSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {dashboardItems.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center bg-white rounded shadow p-4 hover:bg-gray-100 cursor-pointer"
        >
          <item.icon className="w-30 h-32 text-blue-600 mb-2 " />
          <span className="text-sm font-medium text-gray-800">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
