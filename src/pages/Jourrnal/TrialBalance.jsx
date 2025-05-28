import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TrialBalance = () => {
  const { t, i18n } = useTranslation();
  const [trialData, setTrialData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);

  // تاريخ البداية والنهاية للفلترة أو المقارنة
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // جلب ميزان المراجعة العام
  const fetchTrialBalance = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3001/api/trial-balance/getTrialBalance');
      setTrialData(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // جلب ميزان المراجعة لنطاق التاريخ
  const fetchTrialBalanceByDateRange = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3001/api/trial-balance/date-range', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      setTrialData(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // مقارنة الفترات
  const fetchComparison = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3001/api/trial-balance/compare-periods', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          comparisonPeriod: 'last_year'
        }
      });
      setComparisonData(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrialBalance();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{t('Trial Balance')}</h1>

      {/* تاريخ الفلترة والمقارنة */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <div>
          <label className="block text-sm">{t('Start Date')}</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="border rounded px-2 py-1 w-40"
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div>
          <label className="block text-sm">{t('End Date')}</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="border rounded px-2 py-1 w-40"
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <button
          onClick={fetchTrialBalanceByDateRange}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          {t('Filter by Date')}
        </button>
        <button
          onClick={fetchComparison}
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          {t('Compare with Last Year')}
        </button>
      </div>

      {/* جدول ميزان المراجعة */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">{t('Account Code')}</th>
              <th className="p-2 border">{t('Account Name')}</th>
              <th className="p-2 border">{t('Debit')}</th>
              <th className="p-2 border">{t('Credit')}</th>
              <th className="p-2 border">{t('Balance')}</th>
            </tr>
          </thead>
          <tbody>
            {trialData.map((item) => (
              <tr key={item.accountId}>
                <td className="p-2 border">{item.accounts.code}</td>
                <td className="p-2 border">{item.accounts.name}</td>
                <td className="p-2 border text-right">{item.total_debit}</td>
                <td className="p-2 border text-right">{item.total_credit}</td>
                <td className="p-2 border text-right">{item.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* جدول مقارنة الفترات */}
      {comparisonData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">{t('Period Comparison')}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">{t('Account Name')}</th>
                  <th className="p-2 border">{t('Current Debit')}</th>
                  <th className="p-2 border">{t('Current Credit')}</th>
                  <th className="p-2 border">{t('Last Year Debit')}</th>
                  <th className="p-2 border">{t('Last Year Credit')}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item) => (
                  <tr key={item.accountId}>
                    <td className="p-2 border">{item.accountName}</td>
                    <td className="p-2 border text-right">{item.currentPeriodDebit}</td>
                    <td className="p-2 border text-right">{item.currentPeriodCredit}</td>
                    <td className="p-2 border text-right">{item.comparisonPeriodDebit}</td>
                    <td className="p-2 border text-right">{item.comparisonPeriodCredit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading && <div className="mt-4 text-blue-500">{t('Loading...')}</div>}
    </div>
  );
};

export default TrialBalance;
