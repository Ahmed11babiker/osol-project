import React, { useEffect, useState, useRef } from 'react';
import axios from '../../service/axios';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useReactToPrint } from 'react-to-print';

const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

const ProfitReport = () => {
  const [reportData, setReportData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [loading, setLoading] = useState(false);

  const printRef = useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/profit-loss/getProfitAndLoss', {
        params: {
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString()
        }
      });
      const { revenue = 0, expense = 0, netProfit = 0 } = response.data.data;

      // لا تعرض الرسم إن كانت القيم كلها صفر
      if (revenue === 0 && expense === 0 && netProfit === 0) {
        setReportData([]);
      } else {
        const data = [
          { name: 'Revenue', value: revenue },
          { name: 'Expense', value: expense },
          { name: 'Net Profit', value: netProfit }
        ];
        setReportData(data);
      }
    } catch (error) {
      console.error("Error fetching report", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'ProfitAndLossReport',
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Profit and Loss Report</h2>

        <div className="flex items-center gap-2">
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            isClearable
            placeholderText="Select Date Range"
            className="p-2 border rounded-md"
          />
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Get Report
          </button>
          <button
            onClick={handlePrint}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Print
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div ref={printRef} className="bg-white rounded-lg shadow-md p-4">
          {reportData.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No data available for the selected period.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Bar Chart</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Pie Chart</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      label
                      isAnimationActive={true}
                    >
                      {reportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfitReport;
