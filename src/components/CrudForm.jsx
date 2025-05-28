import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import CenteredToast from "./CenteredToast";
import LoadingSpinner from "./LoadingSpinner";

export default function CrudForm({
  fields = [],
  fetchData,
  createItem,
  updateItem,
  deleteItem,
  itemKey = "id",
  title = "العناصر",
}) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editKey, setEditKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const data = await fetchData();
      setItems(data);
    } catch (error) {
      toast.custom(() => (
        <CenteredToast
          message={`❌ خطأ في تحميل البيانات: ${error.message}`}
          bgColor="bg-red-100"
          textColor="text-red-800"
          borderColor="border-red-400"
        />
      ));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || "" : value,
    }));
  };

  const validateForm = () => {
    for (let f of fields) {
      if (form[f.name] === undefined || form[f.name] === "") {
        toast.custom(() => (
          <CenteredToast
            message={`⚠️ الرجاء ملء حقل "${f.label}"`}
            bgColor="bg-yellow-100"
            textColor="text-yellow-800"
            borderColor="border-yellow-400"
          />
        ));
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (editKey !== null) {
        await updateItem(editKey, form);
        toast.custom(() => <CenteredToast message="✅ تم تحديث العنصر بنجاح" />);
      } else {
        await createItem(form);
        toast.custom(() => <CenteredToast message="✅ تم إضافة العنصر بنجاح" />);
      }
      setForm({});
      setEditKey(null);
      await loadItems();
    } catch (error) {
      toast.custom(() => (
        <CenteredToast
          message={`❌ خطأ: ${error.message}`}
          bgColor="bg-red-100"
          textColor="text-red-800"
          borderColor="border-red-400"
        />
      ));
    }
    setIsLoading(false);
  };

  const handleEdit = (item) => {
    const flatItem = {
      ...item,
      itemDescription: item.items?.[0]?.description || "",
      itemQuantity: item.items?.[0]?.quantity || "",
      itemUnitPrice: item.items?.[0]?.unitPrice || "",
      itemTotal: item.items?.[0]?.total || "",
      paymentAmount: item.payment?.amount || "",
      paymentMethod: item.payment?.method || "",
      paymentReference: item.payment?.reference || "",
      paymentDescription: item.payment?.description || "",
    };

    setForm(flatItem);
    setEditKey(item[itemKey]);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    setIsLoading(true);
    try {
      await deleteItem(item[itemKey]);
      toast.custom(() => <CenteredToast message="🗑️ تم حذف العنصر" />);
      await loadItems();
    } catch (error) {
      toast.custom(() => (
        <CenteredToast
          message={`❌ خطأ في الحذف: ${error.message}`}
          bgColor="bg-red-100"
          textColor="text-red-800"
          borderColor="border-red-400"
        />
      ));
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">📋 {title}</h2>
      {isLoading && <LoadingSpinner />}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded shadow"
      >
        {fields.map(({ name, label, type = "text", placeholder, options }) => (
          <div key={name} className="flex flex-col">
            <label className="mb-1 text-sm font-medium">{label}</label>
            {options ? (
              <select
                name={name}
                value={form[name] || ""}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">-- اختر --</option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : type === "textarea" ? (
              <textarea
                name={name}
                placeholder={placeholder || label}
                value={form[name] || ""}
                onChange={handleChange}
                className="border p-2 rounded"
                rows={3}
              />
            ) : (
              <input
                type={type}
                name={name}
                placeholder={placeholder || label}
                value={form[name] || ""}
                onChange={handleChange}
                className="border p-2 rounded"
                step={type === "number" ? "0.01" : undefined}
              />
            )}
          </div>
        ))}

        <div className="col-span-full md:col-span-1 flex gap-2 items-end">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editKey !== null ? "تحديث" : "إضافة"}
          </button>
          {editKey !== null && (
            <button
              type="button"
              onClick={() => {
                setForm({});
                setEditKey(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm text-right rtl">
          <thead className="bg-gray-100">
            <tr>
              {fields.map(({ name, label }) => (
                <th key={name} className="p-2 border-b">
                  {label}
                </th>
              ))}
              <th className="p-2 border-b">العمليات</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item[itemKey]}
                className="border-b odd:bg-white even:bg-gray-50"
              >
                {fields.map(({ name }) => {
                  let value = item[name];

                  if (value === undefined) {
                    if (name.startsWith("item")) {
                      const key = name.replace("item", "").toLowerCase();
                      value = item.items?.[0]?.[key];
                    } else if (name.startsWith("payment")) {
                      const key = name.replace("payment", "").toLowerCase();
                      value = item.payment?.[key];
                    }
                  }

                  return <td key={name} className="p-2">{value}</td>;
                })}
                <td className="p-2 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:underline mx-1"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-red-600 hover:underline mx-1"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
