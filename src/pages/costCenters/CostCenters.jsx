import { useState } from "react";
import { toast } from "react-hot-toast";
import CenteredToast from "../../components/CenteredToast";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function CostCenters() {
  const [centers, setCenters] = useState([]);
  const [input, setInput] = useState({ name: "", code: "", description: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (!input.name || !input.code) {
        toast.custom(() => (
          <CenteredToast
            message="⚠️ يرجى إدخال الاسم والكود"
            bgColor="bg-yellow-100"
            textColor="text-yellow-800"
            borderColor="border-yellow-400"
          />
        ));
        setIsLoading(false);
        return;
      }

      const updatedCenters = [...centers];
      if (editIndex !== null) {
        updatedCenters[editIndex] = { ...input };
        toast.custom(() => (
          <CenteredToast
            message="✏️ تم تحديث مركز التكلفة"
            bgColor="bg-green-100"
            textColor="text-green-800"
            borderColor="border-green-400"
          />
        ));
      } else {
        updatedCenters.push({ ...input });
        toast.custom(() => (
          <CenteredToast
            message="✅ تم إضافة مركز تكلفة"
            bgColor="bg-green-100"
            textColor="text-green-800"
            borderColor="border-green-400"
          />
        ));
      }

      setCenters(updatedCenters);
      setInput({ name: "", code: "", description: "" });
      setEditIndex(null);
      setIsLoading(false);
    }, 800);
  };

  const handleDelete = (index) => {
    setIsLoading(true);
    setTimeout(() => {
      setCenters(centers.filter((_, i) => i !== index));
      toast.custom(() => (
        <CenteredToast
          message="🗑️ تم حذف مركز التكلفة"
          bgColor="bg-red-100"
          textColor="text-red-800"
          borderColor="border-red-400"
        />
      ));
      setIsLoading(false);
    }, 500);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setInput(centers[index]);
    toast.custom(() => (
      <CenteredToast
        message="✏️ يمكنك تعديل هذا المركز الآن"
        bgColor="bg-blue-100"
        textColor="text-blue-800"
        borderColor="border-blue-400"
      />
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">مراكز التكلفة</h1>

      {isLoading && <LoadingSpinner />}

      <form
        onSubmit={handleAddOrUpdate}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded shadow"
      >
        <input
          name="name"
          value={input.name}
          onChange={handleChange}
          placeholder="الاسم"
          className="border p-2 rounded"
        />
        <input
          name="code"
          value={input.code}
          onChange={handleChange}
          placeholder="الكود"
          className="border p-2 rounded"
        />
        <input
          name="description"
          value={input.description}
          onChange={handleChange}
          placeholder="الوصف"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded col-span-full md:col-span-1"
        >
          {editIndex !== null ? "تحديث" : "إضافة"}
        </button>
      </form>

      <div className="overflow-x-auto bg-white p-4 rounded shadow">
        <table className="w-full text-right border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">الاسم</th>
              <th className="p-2 border">الكود</th>
              <th className="p-2 border">الوصف</th>
              <th className="p-2 border">التحكم</th>
            </tr>
          </thead>
          <tbody>
            {centers.map((center, i) => (
              <tr key={i} className="border-t">
                <td className="p-2 border">{center.name}</td>
                <td className="p-2 border">{center.code}</td>
                <td className="p-2 border">{center.description}</td>
                <td className="p-2 border space-x-2">
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
            {centers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  لا توجد مراكز مضافة بعد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
