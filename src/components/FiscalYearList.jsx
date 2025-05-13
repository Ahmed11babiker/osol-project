// 📁 src/components/FiscalYearList.jsx
export default function FiscalYearList({ fiscalYears }) {
    return (
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-bold mb-4">السنوات المالية</h2>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border p-2">اسم السنة المالية</th>
              <th className="border p-2">تاريخ البداية</th>
              <th className="border p-2">تاريخ النهاية</th>
              <th className="border p-2">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {fiscalYears.map((year, index) => (
              <tr key={index}>
                <td className="border p-2">{year.yearName}</td>
                <td className="border p-2">{year.startDate}</td>
                <td className="border p-2">{year.endDate}</td>
                <td className="border p-2">
                  <button className="text-blue-500">تعديل</button>
                  <button className="text-red-500 ml-2">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  