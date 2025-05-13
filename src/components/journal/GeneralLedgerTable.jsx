export default function GeneralLedgerTable({ entries = [] }) {
  let running = 0;
  const rows = entries.map(e => {
    running += e.debit - e.credit;
    return { ...e, balance: running };
  });

  return (
    <div className="bg-white overflow-x-auto shadow rounded">
      <table className="min-w-full text-right">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">التاريخ</th>
            <th className="p-2 border">المرجع</th>
            <th className="p-2 border">الوصف</th>
            <th className="p-2 border">مدين</th>
            <th className="p-2 border">دائن</th>
            <th className="p-2 border">الرصيد</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50">
              <td className="p-2 border">{r.date}</td>
              <td className="p-2 border">{r.ref}</td>
              <td className="p-2 border">{r.desc}</td>
              <td className="p-2 border">{r.debit}</td>
              <td className="p-2 border">{r.credit}</td>
              <td className="p-2 border">{r.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
