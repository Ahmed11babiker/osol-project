import CrudForm from "../../components/CrudForm";
import axios from 'axios';
import { useEffect } from "react";
export default function CostCenters() {


const baseUrl = "http://localhost:3001/api/cost-center";

const fetchBranches = async () => {
    const response = await axios.get(`${baseUrl}/index`);
    return response.data;
  };

  const createBranch = async (data) => {
    await axios.post(`${baseUrl}/create`, data);
  };

  const updateBranch = async (id, data) => {
    await axios.put(`${baseUrl}/update/${id}`, data);
  };

  const deleteBranch = async (id) => {
    await axios.delete(`${baseUrl}/delete/${id}`);
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
