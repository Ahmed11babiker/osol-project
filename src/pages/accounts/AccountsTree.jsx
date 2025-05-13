// 📄 src/pages/AccountsTree.jsx

import { useState } from 'react';

export default function AccountsTree({ lang }) {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: 'الأصول' /* Assets */,
      children: [
        { id: 2, name: 'الصندوق' },
        { id: 3, name: 'البنك' },
      ],
    },
    {
      id: 4,
      name: 'الخصوم' /* Liabilities */,
      children: [{ id: 5, name: 'قروض' }],
    },
  ]);

  const [newAccount, setNewAccount] = useState('');
  const [parentId, setParentId] = useState(null);

  const addAccount = () => {
    const newId = Math.floor(Math.random() * 10000);
    const newAcc = { id: newId, name: newAccount };
    if (parentId) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === parentId
            ? { ...acc, children: [...(acc.children || []), newAcc] }
            : acc
        )
      );
    } else {
      setAccounts((prev) => [...prev, { ...newAcc, children: [] }]);
    }
    setNewAccount('');
    setParentId(null);
  };

  const renderAccounts = (accs, level = 0) =>
    accs.map((acc) => (
      <div key={acc.id} className={`ml-${level * 4} p-1`}>
        <div className="font-semibold text-gray-800">{acc.name}</div>
        {acc.children && renderAccounts(acc.children, level + 1)}
      </div>
    ));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        {lang === 'ar' ? 'شجرة الحسابات' : 'Accounts Tree'}

      </h2>
      

      {/* إضافة حساب */}
      <div className="mb-4 flex flex-col md:flex-row items-start gap-2">
        <input
          type="text"
          value={newAccount}
          onChange={(e) => setNewAccount(e.target.value)}
          placeholder={
            lang === 'ar' ? 'اسم الحساب الجديد' : 'New account name'
          }
          className="border p-2 rounded w-full md:w-64"
        />
        <select
          value={parentId || ''}
          onChange={(e) =>
            setParentId(e.target.value ? parseInt(e.target.value) : null)
          }
          className="border p-2 rounded"
        >
          <option value="">
            {lang === 'ar' ? 'حساب رئيسي' : 'Top-level Account'}
          </option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>
        <button
          onClick={addAccount}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {lang === 'ar' ? 'إضافة الحساب' : 'Add Account'}
        </button>
      </div>

      {/* عرض الشجرة */}
      <div className="border rounded p-4 bg-gray-50 shadow-sm">
        {renderAccounts(accounts)}
      </div>
    </div>
  );
}
