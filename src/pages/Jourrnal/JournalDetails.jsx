// 📁 src/pages/journal/JournalDetails.jsx
export default function JournalDetails({ lines }) {
    return (
      <section className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold mb-2">تفاصيل القيود</h3>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">الحساب</th>
              <th className="border p-2">مدين</th>
              <th className="border p-2">دائن</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((ln, idx) => (
              <tr key={idx}>
                <td className="border p-2 text-center">{idx + 1}</td>
                <td className="border p-2">{ln.account}</td>
                <td className="border p-2">{ln.debit}</td>
                <td className="border p-2">{ln.credit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }