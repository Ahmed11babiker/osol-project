// 📁 src/pages/TypesPage.jsx
import CrudForm from "../../components/CrudForm";

import axios from '../../service/axios';

export default function TypesPage() {

const fetchData = async () => {
    const response = await axios.get(`/account/index`);
    return response.data;
  };

  const createItem = async (data) => {
    await axios.post(`/account/create`, data);
  };

  const updateItem = async (id, data) => {
    await axios.put(`/account/update/${id}`, data);
  };

  const deleteItem = async (id) => {
    await axios.delete(`/account/delete/${id}`);
  };

 const fields = [
    { name: "name", label: "اسم المجموعة" },
  { name: "code", label: "الكود" },

];


  return (
    <CrudForm
      title="أنواع الحسابات"
      fields={fields}
      fetchData={fetchData}
      createItem={createItem}
      updateItem={updateItem}
      deleteItem={deleteItem}
      itemKey="id"
    />
  );
}
