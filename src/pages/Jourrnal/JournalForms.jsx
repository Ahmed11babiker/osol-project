import React, { useEffect, useState } from 'react';
import axios from "../../service/axios";

const CreateJournal = () => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [fiscalYearId, setFiscalYearId] = useState('');
  const [fiscalYears, setFiscalYears] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [entries, setEntries] = useState([
    { accountId: '', costCenterId: '', description: '', debit: 0, credit: 0 }
  ]);

  useEffect(() => {
    axios.get(`/year/index`).then((res) => {
      setFiscalYears(res.data.data || []);
    });

    axios.get(`account/index`).then((res) => {
      setAccounts(res.data || []);
    });

    axios.get(`cost-center/index`).then((res) => {
      setCostCenters(res.data || []);
    });
  }, []);

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const addEntry = () => {
    setEntries([...entries, { accountId: '', costCenterId: '', description: '', debit: 0, credit: 0 }]);
  };

  const removeEntry = (index) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      date,
      description,
      fiscalYearId,
      entries,
    };

    try {
      const res = await axios.post(`jounral/create`, payload);
      alert('Journal created successfully');
      setDate('');
      setDescription('');
      setFiscalYearId('');
      setEntries([{ accountId: '', costCenterId: '', description: '', debit: 0, credit: 0 }]);
    } catch (error) {
      console.error(error);
      alert('Failed to create journal');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">إنشاء قيد يومي</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1">التاريخ</label>
            <input type="date" className="w-full border p-2 rounded" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1">السنة المالية</label>
            <select className="w-full border p-2 rounded" value={fiscalYearId} onChange={(e) => setFiscalYearId(e.target.value)} required>
              <option value="">اختر السنة</option>
              {fiscalYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1">الوصف العام</label>
          <input type="text" className="w-full border p-2 rounded" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center text-blue-700">بنود القيد</h3>
          {entries.map((entry, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 mb-2 items-center">
              <select className="border p-2 rounded" value={entry.accountId} onChange={(e) => handleEntryChange(index, 'accountId', e.target.value)} required>
                <option value="">الحساب</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>

              <select
                className="border p-2 rounded"
                value={entry.costCenterId}
                onChange={(e) => handleEntryChange(index, 'costCenterId', parseInt(e.target.value))}
              >
                <option value="">مركز التكلفة</option>
                {costCenters.map((cc) => (
                  <option key={cc.id} value={cc.id}>
                    {cc.name}
                  </option>
                ))}
              </select>

              <input type="text" placeholder="الوصف" className="border p-2 rounded" value={entry.description} onChange={(e) => handleEntryChange(index, 'description', e.target.value)} />

              <input type="number" placeholder="مدين" className="border p-2 rounded" value={entry.debit} onChange={(e) => handleEntryChange(index, 'debit', parseFloat(e.target.value) || 0)} />

              <input type="number" placeholder="دائن" className="border p-2 rounded" value={entry.credit} onChange={(e) => handleEntryChange(index, 'credit', parseFloat(e.target.value) || 0)} />

              <button type="button" onClick={() => removeEntry(index)} className="text-red-500">❌</button>
            </div>
          ))}
          <button type="button" onClick={addEntry} className="bg-blue-500 text-white px-3 py-1 rounded mt-2">+ إضافة بند</button>
        </div>
        <div className="mt-4">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">💾 حفظ القيد</button>
        </div>
      </form>
    </div>
  );
};

export default CreateJournal;
