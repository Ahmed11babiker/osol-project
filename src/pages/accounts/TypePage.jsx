// 📁 src/pages/TypesPage.jsx
import CrudForm from "../../components/CrudForm";

import axios from '../../service/axios';

export default function TypesPage() {

const fetchData = async () => {
    const response = await axios.get(`account-type/index`);
    return response.data;
  };

  const createItem = async (data) => {
    await axios.post(`account-type/create`, data);
  };

  const updateItem = async (id, data) => {
    await axios.put(`account-type/update/${id}`, data);
  };

  const deleteItem = async (id) => {
    await axios.delete(`account-type/delete/${id}`);
  };

 const fields = [
    { name: "name", label: "اسم النوع" },
  { name: "code", label: "الكود" },

  { name: "type", label: "التصنيف" }, // ← بدلاً من category
];


  return (
    <CrudForm
      title="أنواع الحسابات"
      fields={fields}
      fetchData={fetchData}
      createItem={createItem}
      updateItem={updateItem}
      deleteItem={deleteItem}
      itemKey="id" // تأكد أن الـ API تُرجع كل عنصر مع "id"
    />
  );
}
