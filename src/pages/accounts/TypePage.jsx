// 📁 src/pages/TypesPage.jsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import CenteredToast from "../../components/CenteredToast";
import LoadingSpinner from "../../components/LoadingSpinner";
export default function TypesPage() {
  const [form, setForm] = useState({ code: "", name: "", category: "" });
  const [types, setTypes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true)
    setTimeout(() => {
       if (!form.code || !form.name || !form.category) {
      toast.custom(() => (
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
      const updated = [...types];
      updated[editIndex] = form;
      setTypes(updated);
      setEditIndex(null);
      toast.custom(() => (
        <CenteredToast
          message="✏️ تم تحديث النوع بنجاح"
          bgColor="bg-yellow-100"
          textColor="text-yellow-800"
          borderColor="border-yellow-400"
        />
      ));
    } else {
      setTypes([...types, form]);
      toast.custom(() => (
        <CenteredToast
          message="✅ تم إضافة النوع بنجاح"
        />
      ));
    }
    setForm({ code: "", name: "", category: "" });
    setIsLoading(false)
    }, 500);
   
  };

  const handleEdit = (index) => {
    setIsLoading(true)
    setTimeout(() => {
       setForm(types[index]);
    setEditIndex(index);
    toast.custom(() => (
      <CenteredToast
        message="✏️ يمكنك تعديل النوع الآن"
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
      setTypes(types.filter((_, i) => i !== index));
    if (editIndex === index) {
      setForm({ code: "", name: "", category: "" });
      setEditIndex(null);
    }
    toast.custom(() => (
      <CenteredToast
        message="🗑️ تم حذف النوع"
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
      <h2 className="text-2xl font-bold mb-4">إضافة / تعديل نوع حساب</h2>
      {isLoading && <LoadingSpinner/>}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow grid md:grid-cols-3 gap-4 mb-6"
      >
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
          placeholder="اسم النوع"
          className="border p-2 rounded"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="التصنيف"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {editIndex !== null ? "تحديث النوع" : "حفظ النوع"}
        </button>
      </form>

      {types.length > 0 && (
        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          <h3 className="text-lg font-semibold mb-2">قائمة الأنواع</h3>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">#</th>
                <th className="border p-2">الكود</th>
                <th className="border p-2">الاسم</th>
                <th className="border p-2">التصنيف</th>
                <th className="border p-2">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {types.map((type, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  <td className="border p-2 text-center">{i + 1}</td>
                  <td className="border p-2">{type.code}</td>
                  <td className="border p-2">{type.name}</td>
                  <td className="border p-2">{type.category}</td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(i)}
                      className="text-sm bg-yellow-500 text-white mx-4 px-3 py-1 rounded hover:bg-yellow-600"
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
