// 📁 src/pages/TypesPage.jsx
import CrudForm from "../../components/CrudForm";

import axios from 'axios';

export default function TypesPage() {
const baseUrl = 'http://localhost:3001/api/account-group';

const fetchData = async () => {
    const response = await axios.get(`${baseUrl}/index`);
    return response.data;
  };

  const createItem = async (data) => {
    await axios.post(`${baseUrl}/create`, data);
  };

  const updateItem = async (id, data) => {
    await axios.put(`${baseUrl}/update/${id}`, data);
  };

  const deleteItem = async (id) => {
    await axios.delete(`${baseUrl}/delete/${id}`);
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
      itemKey="id" // تأكد أن الـ API تُرجع كل عنصر مع "id"
    />
  );
}
