import CrudForm from "../../components/CrudForm";
import axios from '../../service/axios';
import { useEffect } from "react";
export default function CostCenters() {



const fetchBranches = async () => {
    const response = await axios.get(`cost-center/index`);
    return response.data;
  };

  const createBranch = async (data) => {
    await axios.post(`cost-center/create`, data);
  };

  const updateBranch = async (id, data) => {
    await axios.put(`cost-center/update/${id}`, data);
  };

  const deleteBranch = async (id) => {
    await axios.delete(`cost-center/delete/${id}`);
  };


 

  const fields = [
    { name: "name", label: "الاسم" },
    { name: "code", label: "الكود" },
    { name: "description", label: "الوصف" },
  ];

  return (
    <CrudForm
      title="مراكز التكلفة"
      fields={fields}
      fetchData={fetchBranches}
      createItem={createBranch}
      updateItem={updateBranch}
      deleteItem={deleteBranch}
    />
  );
}
