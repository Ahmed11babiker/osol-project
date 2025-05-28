import CrudForm from '../../components/CrudForm';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function BranchPage() {
  const { t } = useTranslation();
  const baseUrl = 'http://localhost:3001/api/branch';

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

  return (
    <CrudForm
      title={t('Add Branch')}
      fields={[
        { name: 'name', label: t('Branch Name'), required: true },
        { name: 'code', label: t('Branch Code'), required: true },
        { name: 'address', label: t('Address') },
        { name: 'phone', label: t('Phone') },
      ]}
      fetchData={fetchBranches}
      createItem={createBranch}
      updateItem={updateBranch}
      deleteItem={deleteBranch}
    />
  );
}
