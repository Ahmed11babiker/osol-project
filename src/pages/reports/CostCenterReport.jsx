// src/pages/Reports/CostCenterReport.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from '../../service/axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useReactToPrint } from 'react-to-print';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#8884d8'];

const CostCenterReport = () => {
  const [reportData, setReportData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

  const fetchData = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const response = await axios.get(`/profit-loss/cost-centers-report`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      setReportData(response.data.report || []);
    } catch (err) {
      console.error("Failed to fetch report:", err);
      setReportData([]);
    }
    setLoading(false);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'CostCenterReport'
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Cost Center Report</h2>
        <div className="flex items-center gap-2">
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={update => setDateRange(update)}
            isClearable
            placeholderText="Select date range"
            className="p-2 border rounded-md"
          />
          <button onClick={fetchData} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Get Report
          </button>
          <button onClick={handlePrint} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Print
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div ref={printRef} className="bg-white p-4 rounded shadow-md">
          {reportData.length === 0 ? (
            <p className="text-center text-gray-500">No data available.</p>
          ) : (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">Cost Center</th>
                      <th className="p-2 border">Direct Costs</th>
                      <th className="p-2 border">Indirect Costs</th>
                      <th className="p-2 border">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td className="p-2 border">{item.costCenter}</td>
                        <td className="p-2 border">{item.directCosts}</td>
                        <td className="p-2 border">{item.indirectCosts}</td>
                        <td className="p-2 border font-semibold">{item.totalCost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Total Costs by Center (Bar Chart)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="costCenter" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="totalCost" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Total Costs Distribution (Pie Chart)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData}
                        dataKey="totalCost"
                        nameKey="costCenter"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {reportData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CostCenterReport;
