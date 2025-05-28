import CrudForm from "../../components/CrudForm";
const API_Create = "http://localhost:3001/api/currency/create";
const API_Display = "http://localhost:3001/api/currency/index";
const API_Update = "http://localhost:3001/api/currency/update";
const API_Delete = "http://localhost:3001/api/currency/delete";

export default function Currencies() {
  const fields = [
    { name: "name", label: "اسم العملة", type: "text" },
    { name: "code", label: "الكود", type: "text" },
    { name: "symbol", label: "رمز العملة", type: "text" },
    { name: "rate", label: "المعدل", type: "number" },
  ];

  // جلب العملات من API
  const fetchData = async () => {
    const res = await fetch(API_Display);
    if (!res.ok) throw new Error("فشل جلب العملات");
    return res.json();
  };

  const createItem = async (item) => {
    const res = await fetch(API_Create, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`فشل إضافة العملة: ${errorText}`);
    }
    return res.json();
  };

  const updateItem = async (key, item) => {
    const res = await fetch(`${API_Update}/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`فشل تحديث العملة: ${errorText}`);
    }
    return res.json();
  };

  const deleteItem = async (key) => {
    const res = await fetch(`${API_Delete}/${key}`, { method: "DELETE" });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`فشل حذف العملة: ${errorText}`);
    }
    return res.json();
  };

  return (
    <CrudForm
      title="العملات"
      fields={fields}
      fetchData={fetchData}
      createItem={createItem}
      updateItem={updateItem}
      deleteItem={deleteItem}
      itemKey="id" // أو "code" حسب مفتاح التعريف في بياناتك
    />
  );
}
