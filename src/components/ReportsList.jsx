// 📁 src/components/ReportsList.jsx
export default function ReportsList({ reports }) {
    return (
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-bold mb-4">التقارير</h2>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border p-2">التاريخ</th>
              <th className="border p-2">الفرع</th>
              <th className="border p-2">المركز</th>
              <th className="border p-2">المبلغ</th>
              <th className="border p-2">الشرح</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                <td className="border p-2">{report.date}</td>
                <td className="border p-2">{report.branch}</td>
                <td className="border p-2">{report.center}</td>
                <td className="border p-2">{report.amount}</td>
                <td className="border p-2">{report.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  