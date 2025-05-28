import { useState } from "react";

export default function Agents() {
  const [formData, setFormData] = useState({
    agentName: "",
    company: "",
    address: "",
    phone: "",
    email: "",
    password: "",
  });

  const [agents, setAgents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const companies = ["شركة الأولى", "شركة الثانية", "شركة الثالثة"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      // تعديل وكيل
      const updatedAgents = [...agents];
      updatedAgents[editIndex] = formData;
      setAgents(updatedAgents);
      setEditIndex(null);
    } else {
      // إضافة وكيل جديد
      setAgents([...agents, formData]);
    }

    setFormData({
      agentName: "",
      company: "",
      address: "",
      phone: "",
      email: "",
      password: "",
    });
  };

  const handleDelete = (index) => {
    if (confirm("هل أنت متأكد من حذف هذا الوكيل؟")) {
      const updated = agents.filter((_, i) => i !== index);
      setAgents(updated);
    }
  };

  const handleEdit = (index) => {
    setFormData(agents[index]);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
   <div className="max-w-6xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 p-4 sm:p-6 bg-white rounded shadow space-y-10">

      {/* نموذج الإضافة */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-6">
          {editIndex !== null ? "تعديل بيانات الوكيل" : "إضافة وكيل جديد"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block font-semibold mb-1">اسم الوكيل</label>
            <input
              type="text"
              name="agentName"
              value={formData.agentName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="أدخل اسم الوكيل"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">الشركة</label>
            <select
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">اختر الشركة</option>
              {companies.map((company, index) => (
                <option key={index} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">العنوان</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="أدخل العنوان"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">رقم الهاتف</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="05xxxxxxxx"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">الإيميل</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">كلمة السر</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="********"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
            >
              {editIndex !== null ? "حفظ التعديلات" : "إضافة وكيل"}
            </button>
          </div>
        </form>
      </div>

      {/* جدول الوكلاء */}
      {agents.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">قائمة الوكلاء</h3>
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full border border-gray-200 text-xs md:text-sm text-right">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">اسم الوكيل</th>
                  <th className="p-2 border">الشركة</th>
                  <th className="p-2 border">العنوان</th>
                  <th className="p-2 border">الهاتف</th>
                  <th className="p-2 border">الإيميل</th>
                  <th className="p-2 border">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{agent.agentName}</td>
                    <td className="p-2 border">{agent.company}</td>
                    <td className="p-2 border">{agent.address}</td>
                    <td className="p-2 border">{agent.phone}</td>
                    <td className="p-2 border">{agent.email}</td>
                    <td className="p-2 border space-x-2 text-left">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-yellow-400 text-white px-4 py-2 rounded text-xs"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="bg-red-500 text-white px-4 py-2 rounded text-xs ml-3"
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
      )}
    </div>
  );
}
