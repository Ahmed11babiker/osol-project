import { useEffect, useState } from "react";
import axios from "axios";

export default function CompareOpeningBalances() {
  const [years, setYears] = useState([]);
  const [selected1, setSelected1] = useState("");
  const [selected2, setSelected2] = useState("");
  const [budget1, setBudget1] = useState(null);
  const [budget2, setBudget2] = useState(null);

  // جلب السنوات عند تحميل الصفحة
  useEffect(() => {
    axios.get("http://localhost:3001/api/year/index")
      .then(res => setYears(res.data.data || []))
      .catch(err => console.error("Error fetching years", err));
  }, []);

  // جلب الميزانية عند اختيار سنة
  const fetchOpeningBalance = async (fiscalYearId, setter) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/opening-balance/getByFiscalYear/${fiscalYearId}`);
      const items = (res.data.data || []).map(item => ({
        account: item.Account?.name || "غير معروف",
        debit: parseFloat(item.debit),
        credit: parseFloat(item.credit),
      }));
      setter({ id: fiscalYearId, items });
    } catch (err) {
      console.error(`Error fetching opening balance for year ${fiscalYearId}`, err);
    }
  };

  useEffect(() => {
    if (selected1) fetchOpeningBalance(selected1, setBudget1);
  }, [selected1]);

  useEffect(() => {
    if (selected2) fetchOpeningBalance(selected2, setBudget2);
  }, [selected2]);

  const mergeAccounts = (b1, b2) => {
    const allAccounts = [...new Set([...b1.items, ...b2.items].map(i => i.account))];
    return allAccounts.map(account => {
      const item1 = b1.items.find(i => i.account === account) || { debit: 0, credit: 0 };
      const item2 = b2.items.find(i => i.account === account) || { debit: 0, credit: 0 };
      return {
        account,
        b1_debit: item1.debit,
        b1_credit: item1.credit,
        b2_debit: item2.debit,
        b2_credit: item2.credit,
        diff_debit: item2.debit - item1.debit,
        diff_credit: item2.credit - item1.credit,
      };
    });
  };

  const comparison = (budget1 && budget2) ? mergeAccounts(budget1, budget2) : [];

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">مقارنة الميزانيات الافتتاحية</h2>

      <div className="flex gap-4 justify-center mb-6">
        <select
          value={selected1}
          onChange={(e) => setSelected1(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">اختر السنة الأولى</option>
          {years.map((year) => (
            <option key={year.id} value={year.id}>{year.year}</option>
          ))}
        </select>

        <select
          value={selected2}
          onChange={(e) => setSelected2(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">اختر السنة الثانية</option>
          {years.map((year) => (
            <option key={year.id} value={year.id}>{year.year}</option>
          ))}
        </select>
      </div>

      {comparison.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">الحساب</th>
                <th className="border p-2">مدين ({years.find(y => y.id == selected1)?.year})</th>
                <th className="border p-2">دائن ({years.find(y => y.id == selected1)?.year})</th>
                <th className="border p-2">مدين ({years.find(y => y.id == selected2)?.year})</th>
                <th className="border p-2">دائن ({years.find(y => y.id == selected2)?.year})</th>
                <th className="border p-2 text-blue-700">فرق المدين</th>
                <th className="border p-2 text-blue-700">فرق الدائن</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2">{row.account}</td>
                  <td className="border p-2">{row.b1_debit}</td>
                  <td className="border p-2">{row.b1_credit}</td>
                  <td className="border p-2">{row.b2_debit}</td>
                  <td className="border p-2">{row.b2_credit}</td>
                  <td className={`border p-2 ${row.diff_debit !== 0 ? "text-blue-600 font-semibold" : ""}`}>
                    {row.diff_debit}
                  </td>
                  <td className={`border p-2 ${row.diff_credit !== 0 ? "text-blue-600 font-semibold" : ""}`}>
                    {row.diff_credit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!selected1 || !selected2 ? (
        <p className="text-center text-gray-500 mt-4">يرجى اختيار ميزانيتين للمقارنة</p>
      ) : null}
    </div>
  );
}
