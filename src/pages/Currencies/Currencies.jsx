import CrudForm from "../../components/CrudForm";
import axios from "../../service/axios";
const API_Create = "/currency/create";
const API_Display = "/currency/index";
const API_Update = "/currency/update";
const API_Delete = "/currency/delete";

export default function Currencies() {
  const currencyOptions = [
    { name: "الجنيه السوداني", symbol: "SDG" },
    { name: "الجنيه المصري", symbol: "EGP" },
    { name: "الريال السعودي", symbol: "SAR" },
    { name: "الدرهم الإماراتي", symbol: "AED" },
    { name: "اليورو", symbol: "EUR" },
    { name: "الدولار الأمريكي", symbol: "USD" },
    { name: "الدينار الأردني", symbol: "JOD" },
  ];

  const fields = [
    {
      name: "name",
      label: "اسم العملة",
      type: "select",
      options: currencyOptions.map((c) => ({
        label: c.name,
        value: c.name,
      })),
    },
    {
      name: "symbol",
      label: "رمز العملة",
      type: "select",
      options: currencyOptions.map((c) => ({
        label: `${c.symbol} - ${c.name}`,
        value: c.symbol,
      })),
    },
    { name: "code", label: "الكود", type: "text" },
    { name: "rate", label: "المعدل", type: "number" },
  ];

  const fetchData = async () => {
    const res = await axios.get(API_Display);
    console.log(res.data)
    if (!res.status === 200) throw new Error("فشل جلب العملات");
    return res.data;
  };

 const createItem = async (item) => {
    const res = await fetch(API_Create, { item });
    if (!res.status === 201) {
      const errorText = await res.text();
      throw new Error(`فشل إضافة العملة: ${errorText}`);
    }
    return res.data;
  };

 const updateItem = async (key, item) => {
    const res = await axios.put(`${API_Update}/${key}`, { item });
    if (!res.status === 200) {
      const errorText = await res.text();
      throw new Error(`فشل تحديث العملة: ${errorText}`);
    }
    return res.data;
  };

    const deleteItem = async (key) => {
    const res = await axios.delete(`${API_Delete}/${key}`);
    if (!res.status === 200) {
      const errorText = await res.text();
      throw new Error(`فشل حذف العملة: ${errorText}`);
    }
    return res.data;
  };

  return (
    <CrudForm
      title="العملات"
      fields={fields}
      fetchData={fetchData}
      createItem={createItem}
      updateItem={updateItem}
      deleteItem={deleteItem}
      itemKey="id"
    />
  );
}
