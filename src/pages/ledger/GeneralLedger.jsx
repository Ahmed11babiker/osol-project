import { useState } from "react";
import { toast } from "react-hot-toast";
import GeneralLedgerFilters from "../../components/journal/GeneralLedgerFilters";
import GeneralLedgerSummary from "../../components/journal/GeneralLedgerSummary";
import GeneralLedgerTable from "../../components/journal/GeneralLedgerTable";
import LoadingSpinner from "../../components/LoadingSpinner";
export default function GeneralLedger() {
  const [filter, setFilter] = useState({ account: "", startDate: "", endDate: "" });
  const [entries, setEntries] = useState([]); // fetched or dummy data
  const [isLoading, setIsLoading] = useState(false);
  const handleFilter = (newFilter) => {
    setIsLoading(true)
    setTimeout(() => {
      setFilter(newFilter);
    setEntries([
      { id: 1, date: "2025-01-01", ref: "JV001", desc: "رصيد افتتاحي", debit: 0, credit: 0 },
      { id: 2, date: "2025-01-05", ref: "JV002", desc: "مبيعات", debit: 0, credit: 5000 },
      { id: 3, date: "2025-01-10", ref: "JV003", desc: "مشتريات", debit: 3000, credit: 0 }
    ]);
    toast.success("✅ تم تطبيق الفلتر بنجاح");
    setIsLoading(false)
    }, 500);
    
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">📖 دفتر الأستاذ</h2>
      {isLoading && <LoadingSpinner/>}
      <GeneralLedgerFilters onApply={handleFilter} />
      <GeneralLedgerSummary entries={entries} />
      <GeneralLedgerTable entries={entries} />
    </div>
  );
}
