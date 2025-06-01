import CrudForm from '../../components/CrudForm';
import axios from '../../service/axios';
import { useTranslation } from 'react-i18next';

export default function BranchPage() {
  const { t } = useTranslation();

  const fetchBranches = async () => {
    const response = await axios.get(`branch/index`);
    return response.data;
  };

  const createBranch = async (data) => {
    await axios.post(`branch/create`, data);
  };

  const updateBranch = async (id, data) => {
    await axios.put(`branch/update/${id}`, data);
  };

  const deleteBranch = async (id) => {
    await axios.delete(`branch/delete/${id}`);
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
