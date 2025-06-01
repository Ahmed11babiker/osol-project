// 📁 src/pages/AccountForm.jsx
import { useEffect, useState } from "react";
import axios from "../../service/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import CenteredToast from "../../components/CenteredToast";

export default function AccountForm({ initialData = {} }) {

  const [accountTypes, setAccountTypes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [accountsList, setAccountsList] = useState([]);

  const [form, setForm] = useState({
    code: initialData.code || "",
    name: initialData.name || "",
    level: initialData.level || "",
    accountTypeId: initialData.accountTypeId || "",
    groupId: initialData.groupId || "",
    currencyId: initialData.currencyId || "",
    branchId: initialData.branchId || "",
    costCenterId: initialData.costCenterId || "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchOptions();
    fetchAccountsList();
  }, []);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const [atRes, gRes, cRes, bRes, ccRes] = await Promise.all([
        axios.get(`/account-type/index`),
        axios.get(`/account-group/index`),
        axios.get(`/currency/index`),
        axios.get(`/branch/index`),
        axios.get(`/cost-center/index`),
      ]);
      setAccountTypes(atRes.data.data || atRes.data);
      setGroups(gRes.data.data || gRes.data);
      setCurrencies(cRes.data.data || cRes.data);
      setBranches(bRes.data.data || bRes.data);
      setCostCenters(ccRes.data.data || ccRes.data);
    } catch (err) {
      console.error(err);
      setToast("فشل في جلب قوائم الاختيارات");
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountsList = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/account/index`);
      setAccountsList(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      setToast("فشل في جلب قائمة الحسابات");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fullPayload = { ...form };

      if (initialData.id) {
        const updatedFields = {};
        for (let key in fullPayload) {
          if (fullPayload[key] !== initialData[key]) {
            updatedFields[key] = fullPayload[key];
          }
        }

        if (Object.keys(updatedFields).length === 0) {
          setToast("لم يتم تعديل أي بيانات");
        } else {
          await axios.put(`${API}/account/update/${initialData.id}`, updatedFields);
          setToast("تم تعديل الحساب");
        }
      } else {
        await axios.post(`${API}/account/create`, fullPayload);
        setToast("تم إنشاء الحساب");
      }

      setForm({
        code: "",
        name: "",
        level: "",
        accountTypeId: "",
        groupId: "",
        currencyId: "",
        branchId: "",
        costCenterId: "",
      });

      fetchAccountsList();
    } catch (err) {
      console.error(err.response || err);
      setToast(`خطأ من الخادم: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (acct) => {
    setForm({
      code: acct.code,
      name: acct.name,
      level: acct.level,
      accountTypeId: acct.accountTypeId,
      groupId: acct.groupId,
      currencyId: acct.currencyId,
      branchId: acct.branchId,
      costCenterId: acct.costCenterId || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذا الحساب؟")) return;
    setLoading(true);
    try {
      await axios.delete(`${API}/account/delete/${id}`);
      setToast("تم حذف الحساب");
      fetchAccountsList();
    } catch (err) {
      console.error(err);
      setToast("فشل في حذف الحساب");
    } finally {
      setLoading(false);
    }
  };

  const getNameById = (list, id) => {
    const item = list.find((i) => i.id === id);
    return item?.name || "-";
  };

  return (
    <div className="max-w-6xl mx-auto p-4 relative">
      {loading && <LoadingSpinner />}
      {toast && <CenteredToast message={toast} onClose={() => setToast("")} />}

      <h2 className="text-2xl font-bold mb-4">إنشاء / تعديل حساب</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white p-4 rounded shadow"
      >
        <div>
          <label className="block mb-1">الاسم</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">الكود</label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">المستوى</label>
          <input
            name="level"
            type="number"
            value={form.level}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">نوع الحساب</label>
          <select
            name="accountTypeId"
            value={form.accountTypeId}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">اختر</option>
            {accountTypes.map((at) => (
              <option key={at.id} value={at.id}>{at.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">المجموعة</label>
          <select
            name="groupId"
            value={form.groupId}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">اختر</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">العملة</label>
          <select
            name="currencyId"
            value={form.currencyId}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">اختر</option>
            {currencies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">الفرع</label>
          <select
            name="branchId"
            value={form.branchId}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">اختر</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">مركز التكلفة</label>
          <select
            name="costCenterId"
            value={form.costCenterId}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">اختر</option>
            {costCenters.map((cc) => (
              <option key={cc.id} value={cc.id}>{cc.name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="col-span-full bg-blue-600 text-white py-2 rounded"
        >
          حفظ
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">قائمة الحسابات</h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-right border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">الكود</th>
              <th className="p-2 border">الاسم</th>
              <th className="p-2 border">المستوى</th>
              <th className="p-2 border">نوع الحساب</th>
              <th className="p-2 border">المجموعة</th>
              <th className="p-2 border">العملة</th>
              <th className="p-2 border">الفرع</th>
              <th className="p-2 border">مركز التكلفة</th>
              <th className="p-2 border">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {accountsList.map((acct) => (
              <tr key={acct.id} className="hover:bg-gray-50">
                <td className="p-2 border">{acct.code}</td>
                <td className="p-2 border">{acct.name}</td>
                <td className="p-2 border">{acct.level}</td>
                <td className="p-2 border">{getNameById(accountTypes, acct.accountTypeId)}</td>
                <td className="p-2 border">{getNameById(groups, acct.groupId)}</td>
                <td className="p-2 border">{getNameById(currencies, acct.currencyId)}</td>
                <td className="p-2 border">{getNameById(branches, acct.branchId)}</td>
                <td className="p-2 border">{getNameById(costCenters, acct.costCenterId)}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(acct)}
                    className="text-blue-600 hover:underline"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(acct.id)}
                    className="text-red-600 hover:underline"
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
