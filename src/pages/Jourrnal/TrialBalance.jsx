// 📁 src/pages/Jourrnal/TrialBalance.jsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import CenteredToast from "../../components/CenteredToast";
import LoadingSpinner from "../../components/LoadingSpinner";

const TrialBalance = ({ lang }) => {
  const [trialBalanceData, setTrialBalanceData] = useState([
    { id: 1, name: lang === "ar" ? "النقد" : "Cash", debit: 5000, credit: 0 },
    {
      id: 2,
      name: lang === "ar" ? "المبيعات" : "Sales",
      debit: 0,
      credit: 15000,
    },
    {
      id: 3,
      name: lang === "ar" ? "المصروفات" : "Expenses",
      debit: 3000,
      credit: 0,
    },
    { id: 4, name: lang === "ar" ? "الديون" : "Loans", debit: 0, credit: 7000 },
    {
      id: 5,
      name: lang === "ar" ? "المخزون" : "Inventory",
      debit: 4000,
      credit: 0,
    },
  ]);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ name: "", debit: "", credit: "" });
  const [isLoading, setIsLoading] = useState(false);
  const handleEdit = (index) => {
    setIsLoading(true);
    setTimeout(() => {
      setEditIndex(index);
      setForm(trialBalanceData[index]);
      toast.custom(() => (
        <CenteredToast
          message="✏️ يمكنك تعديل السطر الآن"
          bgColor="bg-blue-100"
          textColor="text-blue-800"
          borderColor="border-blue-400"
        />
      ));
      setIsLoading(false);
    }, 500);
  };

  const handleDelete = (index) => {
    setIsLoading(true);
    setTimeout(() => {
      setTrialBalanceData(trialBalanceData.filter((_, i) => i !== index));
      if (editIndex === index) {
        setEditIndex(null);
        setForm({ name: "", debit: "", credit: "" });
      }
      toast.custom(() => (
        <CenteredToast
          message="🗑️ تم حذف السطر"
          bgColor="bg-red-100"
          textColor="text-red-800"
          borderColor="border-red-400"
        />
      ));
      setIsLoading(false);
    }, 500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      const updated = [...trialBalanceData];
      updated[editIndex] = {
        ...form,
        id: updated[editIndex].id,
        debit: parseFloat(form.debit) || 0,
        credit: parseFloat(form.credit) || 0,
      };
      setTrialBalanceData(updated);
      setEditIndex(null);
      setForm({ name: "", debit: "", credit: "" });
      toast.custom(() => (
        <CenteredToast
          message="✔️ تم حفظ التعديلات"
          bgColor="bg-green-100"
          textColor="text-green-800"
          borderColor="border-green-400"
        />
      ));
      setIsLoading(false);
    }, 500);
  };

  const totalDebit = trialBalanceData.reduce(
    (sum, item) => sum + item.debit,
    0
  );
  const totalCredit = trialBalanceData.reduce(
    (sum, item) => sum + item.credit,
    0
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {lang === "ar" ? "ميزان المراجعة" : "Trial Balance"}
      </h2>
      {isLoading && <LoadingSpinner />}
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto ">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100 text-gray-700 text-center">
            <tr>
              <th className="p-2">{lang === "ar" ? "الحساب" : "Account"}</th>
              <th className="p-2">{lang === "ar" ? "مدين" : "Debit"}</th>
              <th className="p-2">{lang === "ar" ? "دائن" : "Credit"}</th>
              <th className="p-2">{lang === "ar" ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {trialBalanceData.map((item, index) => (
              <tr key={item.id} className="border-b text-center">
                {editIndex === index ? (
                  <>
                    <td className="p-2 text-center">
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded w-full text-center"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        name="debit"
                        value={form.debit}
                        onChange={handleChange}
                        type="number"
                        className="border px-2 py-1 rounded w-full text-right"
                      />
                    </td>
                    <td className="p-">
                      <input
                        name="credit"
                        value={form.credit}
                        onChange={handleChange}
                        type="number"
                        className="border px-2 py-1 rounded w-full text-right"
                      />
                    </td>
                    <td className="p-2 space-x-1">
                      <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        {lang === "ar" ? "حفظ" : "Save"}
                      </button>
                      <button
                        onClick={() => setEditIndex(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        {lang === "ar" ? "إلغاء" : "Cancel"}
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2 text-right">
                      {item.debit} {lang === "ar" ? "ج.م" : "EGP"}
                    </td>
                    <td className="p-2 text-right">
                      {item.credit} {lang === "ar" ? "ج.م" : "EGP"}
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-blue-600 hover:underline px-3"
                      >
                        {lang === "ar" ? "تعديل" : "Edit"}
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-600 hover:underline"
                      >
                        {lang === "ar" ? "حذف" : "Delete"}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 text-right font-semibold">
          <p>
            {lang === "ar" ? "إجمالي المدين:" : "Total Debit:"} {totalDebit}{" "}
            {lang === "ar" ? "ج.م" : "EGP"}
          </p>
          <p>
            {lang === "ar" ? "إجمالي الدائن:" : "Total Credit:"} {totalCredit}{" "}
            {lang === "ar" ? "ج.م" : "EGP"}
          </p>
        </div>

        <div className="mt-4 text-center">
          {totalDebit === totalCredit ? (
            <p className="text-green-600 font-bold">
              {lang === "ar"
                ? "التوازن صحيح ✅"
                : "The trial balance is correct ✅"}
            </p>
          ) : (
            <p className="text-red-600 font-bold">
              {lang === "ar"
                ? "التوازن غير صحيح ❌"
                : "The trial balance is incorrect ❌"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrialBalance;
