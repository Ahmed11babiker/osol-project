import { useState } from "react";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function JournalEntryForm({ lines, setLines }) {
  const [input, setInput] = useState({
    journalBook: '',
    account: '',
    description: '',
    costCenter: '',
    debit: '',
    credit: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const handleAdd = e => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (!input.journalBook || !input.account) {
        toast.error("❌ يرجى إدخال دفتر اليومية والحساب");
        setIsLoading(false);
        return;
      }
      setLines([...lines, { ...input }]);
      toast.success("✅ تم إضافة السطر بنجاح");
      resetForm();
      setIsLoading(false);
    }, 500);
  };

  const handleDelete = index => {
    setIsLoading(true);
    setTimeout(() => {
      setLines(lines.filter((_, i) => i !== index));
      toast.success("🗑️ تم حذف السطر بنجاح");
      setIsLoading(false);
    }, 500);
  };

  const startEdit = index => {
    setEditIndex(index);
    setInput(lines[index]);
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedLines = [...lines];
      updatedLines[editIndex] = { ...input };

      const totalDebit = updatedLines.reduce(
        (sum, line) => sum + parseFloat(line.debit || 0),
        0
      );
      const totalCredit = updatedLines.reduce(
        (sum, line) => sum + parseFloat(line.credit || 0),
        0
      );

      if (totalDebit !== totalCredit) {
        toast.error("⚠️ يجب أن يتساوى مجموع المدين والدائن");
        setIsLoading(false);
        return;
      }

      setLines(updatedLines);
      toast.success("✏️ تم حفظ التعديل بنجاح");
      resetForm();
      setIsLoading(false);
    }, 500);
  };

  const cancelEdit = () => {
    setIsLoading(true);
    setTimeout(() => {
      resetForm();
      setIsLoading(false);
    }, 500);
  };

  const resetForm = () => {
    setEditIndex(null);
    setInput({
      journalBook: '',
      account: '',
      description: '',
      costCenter: '',
      debit: '',
      credit: ''
    });
  };

  return (
    <section className="bg-white p-4 shadow rounded space-y-4">
      <h3 className="font-semibold mb-2">إدخال قيود</h3>
      {isLoading && <LoadingSpinner />}
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <input
            name="journalBook"
            value={input.journalBook}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="دفتر اليومية"
            required
          />
          <input
            name="account"
            value={input.account}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="الحساب"
            required
          />
          <input
            name="description"
            value={input.description}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="الوصف"
          />
          <input
            name="costCenter"
            value={input.costCenter}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="مركز التكلفة"
          />
          <input
            type="number"
            name="debit"
            value={input.debit}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="مدين"
          />
          <input
            type="number"
            name="credit"
            value={input.credit}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="دائن"
          />
        </div>
        <div className="flex justify-start">
          {editIndex === null ? (
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
            >
              إضافة سطر
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSave}
                className="bg-green-600 text-white py-2 px-6 mx-3 rounded hover:bg-green-700"
              >
                حفظ 
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-600 text-white py-2 px-6 rounded hover:bg-gray-700 ml-4"
              >
        إلغاء
              </button>
            </>
          )}
        </div>
      </form>

      {lines.length > 0 && (
        <div className="overflow-x-auto mt-4 rounded border">
          <table className="min-w-full text-sm text-center border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border p-2">#</th>
                <th className="border p-2">دفتر</th>
                <th className="border p-2">الحساب</th>
                <th className="border p-2">الوصف</th>
                <th className="border p-2">مركز التكلفة</th>
                <th className="border p-2">مدين</th>
                <th className="border p-2">دائن</th>
                <th className="border p-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  <td className="border p-2">{idx + 1}</td>
                  <td className="border p-2">{line.journalBook}</td>
                  <td className="border p-2">{line.account}</td>
                  <td className="border p-2">{line.description}</td>
                  <td className="border p-2">{line.costCenter}</td>
                  <td className="border p-2">{line.debit}</td>
                  <td className="border p-2">{line.credit}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => startEdit(idx)}
                      className="text-blue-600 hover:underline"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="text-red-600 hover:underline"
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
    </section>
  );
}
