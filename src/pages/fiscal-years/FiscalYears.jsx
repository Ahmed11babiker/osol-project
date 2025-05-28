// 📁 src/pages/fiscal-years/FiscalYears.jsx
import CrudForm from "../../components/CrudForm";
import axios from "axios";

const FiscalYears = ({ lang }) => {
  const baseUrl = "http://localhost:3001/api/year";

  // 1. تعريف الحقول التي سيستخدمها الكردفورم
  const fields = [
    {
      name: "year",
      label: lang === "ar" ? "اسم السنة" : "Year",
      placeholder: lang === "ar" ? "أدخل اسم السنة" : "Enter year name",
    },
    {
      name: "startDate",
      label: lang === "ar" ? "تاريخ البداية" : "Start Date",
      type: "date",
    },
    {
      name: "endDate",
      label: lang === "ar" ? "تاريخ النهاية" : "End Date",
      type: "date",
    },
  ];

  // 2. عمليات CRUD

const fetchData = async () => {
  const response = await axios.get(`${baseUrl}/index`);
  return response.data.data; // أو حسب المفتاح الصحيح في الاستجابة
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


  return (
    <div className="container mx-auto p-4">
      <CrudForm
        title={lang === "ar" ? "السنوات المالية" : "Fiscal Years"}
        fields={fields}
        fetchData={fetchData}
        createItem={createItem}
        updateItem={updateItem}
        deleteItem={deleteItem}
        itemKey="id" // هذا يجب أن يطابق الـ id الموجود في العنصر من الـ API
      />
    </div>
  );
};

export default FiscalYears;
