// 📁 src/components/journal/GeneralLedgerSummary.jsx
export default function GeneralLedgerSummary({ entries }) {
    const openingBalance = entries.length ? 0 : 0;
    const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0);
    const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0);
    const closingBalance = openingBalance + totalDebit - totalCredit;
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold">رصيد افتتاحي</h4>
          <p>{openingBalance}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold">إجمالي مدين</h4>
          <p>{totalDebit}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold">إجمالي دائن</h4>
          <p>{totalCredit}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold">رصيد إغلاق</h4>
          <p>{closingBalance}</p>
        </div>
      </div>
    );
  }
  