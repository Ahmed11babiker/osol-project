import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BalanceSheet = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const printRef = useRef(null); // المرجع للطباعة

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/balance-sheet/getBalanceSheet', {
        params: startDate && endDate ? { startDate, endDate } : {}
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching balance sheet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('balance-sheet.pdf');
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!data) return <div className="text-center mt-10">No data available.</div>;

  const { summary, breakdown } = data;

  const renderSection = (title, items, color = 'text-gray-800') => (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className={`text-lg font-semibold mb-2 ${color}`}>{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No records found.</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between text-sm">
              <span>{item.name}</span>
              <span className="font-semibold">{item.balance.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📊 Balance Sheet</h1>
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          طباعة PDF
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Filter
        </button>
      </div>

      {/* Printable Content */}
      <div ref={printRef}>
        
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-100 rounded-xl p-4 text-blue-800">
            <h2 className="text-sm">Assets</h2>
            <p className="text-lg font-bold">{summary.assets.toFixed(2)}</p>
          </div>
          <div className="bg-red-100 rounded-xl p-4 text-red-800">
            <h2 className="text-sm">Liabilities</h2>
            <p className="text-lg font-bold">{summary.liabilities.toFixed(2)}</p>
          </div>
          <div className="bg-green-100 rounded-xl p-4 text-green-800">
            <h2 className="text-sm">Equity</h2>
            <p className="text-lg font-bold">{summary.equity.toFixed(2)}</p>
          </div>
          <div className="bg-yellow-100 rounded-xl p-4 text-yellow-800">
            <h2 className="text-sm">Revenue</h2>
            <p className="text-lg font-bold">{summary.revenue.toFixed(2)}</p>
          </div>
          <div className="bg-purple-100 rounded-xl p-4 text-purple-800">
            <h2 className="text-sm">Expenses</h2>
            <p className="text-lg font-bold">{summary.expenses.toFixed(2)}</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderSection('Assets', breakdown.assets, 'text-blue-700')}
          {renderSection('Liabilities', breakdown.liabilities, 'text-red-700')}
          {renderSection('Revenue', breakdown.revenue, 'text-yellow-700')}
          {renderSection('Expenses', breakdown.expenses, 'text-purple-700')}
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
