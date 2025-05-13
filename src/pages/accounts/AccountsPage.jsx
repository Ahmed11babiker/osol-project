// 📁 src/pages/AccountsPage.jsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import CenteredToast from "../../components/CenteredToast";
import LoadingSpinner from "../../components/LoadingSpinner";
export default function AccountsPage() {
  const [form, setForm] = useState({
    code: "",
    name: "",
    level: "",
    type: "",
    currency: "",
    branch: "",
    costCenter: "",
  });

  const [accounts, setAccounts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {

    e.preventDefault();
    setIsLoading(true)
    setTimeout(() => {
      if (editIndex !== null) {
      const updated = [...accounts];
      updated[editIndex] = form;
      setAccounts(updated);
      setEditIndex(null);
      toast.custom(() => (
        <CenteredToast
          message="✏️ تم تحديث الحساب بنجاح"
          bgColor="bg-yellow-100"
          textColor="text-yellow-800"
          borderColor="border-yellow-400"
        />
      ));
    } else {
      setAccounts([...accounts, form]);
      toast.custom(() => (
        <CenteredToast
          message="✅ تم إضافة الحساب بنجاح"
        />
        
      ));
      
    }
    setForm({ code: "", name: "", level: "", type: "", currency: "", branch: "", costCenter: "" });
    setIsLoading(false)
    }, 500);
    
  };

  const handleEdit = (index) => {
    setIsLoading(true)
    setTimeout(() => {
      setForm(accounts[index]);
    setEditIndex(index);
    toast.custom(() => (
      <CenteredToast
        message="✏️ يمكنك تعديل الحساب الآن"
        bgColor="bg-blue-100"
        textColor="text-blue-800"
        borderColor="border-blue-400"
      />
    ));
    setIsLoading(false)
    }, 500);
  };

  const handleDelete = (index) => {
    setIsLoading(true)
    setTimeout(() => {
      const updated = accounts.filter((_, i) => i !== index);
    setAccounts(updated);
    if (editIndex === index) {
      setForm({ code: "", name: "", level: "", type: "", currency: "", branch: "", costCenter: "" });
      setEditIndex(null);
    }
    toast.custom(() => (
      <CenteredToast
        message="🗑️ تم حذف الحساب"
        bgColor="bg-red-100"
        textColor="text-red-800"
        borderColor="border-red-400"
      />
    ));
    setIsLoading(false)
    }, 500);
    
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">إضافة / تعديل حساب</h2>
      {isLoading && <LoadingSpinner/>}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6"
      >
        <input name="code" value={form.code} onChange={handleChange} placeholder="الكود" className="border p-2 rounded" />
        <input name="name" value={form.name} onChange={handleChange} placeholder="اسم الحساب" className="border p-2 rounded" />
        <input name="level" value={form.level} onChange={handleChange} placeholder="المستوى" className="border p-2 rounded" />
        <input name="type" value={form.type} onChange={handleChange} placeholder="نوع الحساب" className="border p-2 rounded" />
        <input name="currency" value={form.currency} onChange={handleChange} placeholder="العملة" className="border p-2 rounded" />
        <input name="branch" value={form.branch} onChange={handleChange} placeholder="الفرع" className="border p-2 rounded" />
        <input name="costCenter" value={form.costCenter} onChange={handleChange} placeholder="مركز التكلفة" className="border p-2 rounded" />
        <button type="submit" className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded">
          {editIndex !== null ? "تحديث الحساب" : "حفظ الحساب"}
        </button>
      </form>

      {accounts.length > 0 && (
        <div className="overflow-x-auto bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">قائمة الحسابات</h3>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">#</th>
                <th className="border p-2">الكود</th>
                <th className="border p-2">الاسم</th>
                <th className="border p-2">المستوى</th>
                <th className="border p-2">النوع</th>
                <th className="border p-2">العملة</th>
                <th className="border p-2">الفرع</th>
                <th className="border p-2">مركز التكلفة</th>
                <th className="border p-2">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  <td className="border p-2 text-center">{i + 1}</td>
                  <td className="border p-2">{acc.code}</td>
                  <td className="border p-2">{acc.name}</td>
                  <td className="border p-2">{acc.level}</td>
                  <td className="border p-2">{acc.type}</td>
                  <td className="border p-2">{acc.currency}</td>
                  <td className="border p-2">{acc.branch}</td>
                  <td className="border p-2">{acc.costCenter}</td>
                  <td className="border p-2 space-x-2 text-center">
                    <button
                      onClick={() => handleEdit(i)}
                      className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
