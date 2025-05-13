// 📁 src/pages/GroupsPage.jsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import CenteredToast from "../../components/CenteredToast";
import LoadingSpinner from "../../components/LoadingSpinner";
export default function GroupsPage() {
  const [form, setForm] = useState({ code: "", name: "" });
  const [groups, setGroups] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true)
    setTimeout(() => {
      if (!form.code || !form.name) {
      toast.custom((t) => (
        <CenteredToast
          message="⚠️ الرجاء ملء جميع الحقول"
          bgColor="bg-yellow-100"
          textColor="text-yellow-800"
          borderColor="border-yellow-400"
        />
      ));
      return;
    }
    if (editIndex !== null) {
      const updated = [...groups];
      updated[editIndex] = form;
      setGroups(updated);
      setEditIndex(null);
      toast.custom((t) => (
        <CenteredToast
          message="✏️ تم تحديث المجموعة بنجاح"
          bgColor="bg-yellow-100"
          textColor="text-yellow-800"
          borderColor="border-yellow-400"
        />
      ));
    } else {
      setGroups([...groups, form]);
      toast.custom((t) => (
        <CenteredToast
          message="✅ تم إضافة المجموعة بنجاح"
        />
      ));
    }
    setForm({ code: "", name: "" });
    setIsLoading(false)
    }, 500);
    
  };

  const handleEdit = (index) => {
    setIsLoading(true)
    setTimeout(() => {
      setForm(groups[index]);
    setEditIndex(index);
    toast.custom((t) => (
      <CenteredToast
        message="✏️ يمكنك تعديل المجموعة الآن"
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
      setGroups(groups.filter((_, i) => i !== index));
    if (editIndex === index) {
      setForm({ code: "", name: "" });
      setEditIndex(null);
    }
    toast.custom((t) => (
      <CenteredToast
        message="🗑️ تم حذف المجموعة"
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
      <h2 className="text-2xl font-bold mb-4">إضافة / تعديل مجموعة حساب</h2>
      {isLoading && <LoadingSpinner/>}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow grid gap-4 md:grid-cols-2 mb-6">
        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="الكود"
          className="border p-2 rounded"
        />
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="اسم المجموعة"
          className="border p-2 rounded"
        />
        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded">
          {editIndex !== null ? "تحديث المجموعة" : "حفظ المجموعة"}
        </button>
      </form>

      {groups.length > 0 && (
        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          <h3 className="text-lg font-semibold mb-2">قائمة المجموعات</h3>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">#</th>
                <th className="border p-2">الكود</th>
                <th className="border p-2">الاسم</th>
                <th className="border p-2">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  <td className="border p-2 text-center">{i + 1}</td>
                  <td className="border p-2">{group.code}</td>
                  <td className="border p-2">{group.name}</td>
                  <td className="border p-2 text-center space-x-2 ">
                    <button
                      onClick={() => handleEdit(i)}
                      className="text-sm bg-yellow-500 text-white px-3 py-2 mx-2 rounded hover:bg-yellow-600"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="text-sm bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
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
