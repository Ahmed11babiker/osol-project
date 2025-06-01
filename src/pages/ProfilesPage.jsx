import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../service/axios"; // تأكد أن هذا الملف يحتوي على baseURL
import { useUser } from "../context/UserContext";

export default function ProfilePage() {
  // const { setName, setImage } = useUser();
  const { userId, setName, setImage } = useUser();
// 👈 عدّل هذا لاحقًا ليأخذ من المستخدم الحالي
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    image: "",
  });
  const [isEditable, setIsEditable] = useState(false);
  const [isModified, setIsModified] = useState(false);

  // ✅ جلب بيانات المستخدم من السيرفر


useEffect(() => {
  if (!userId) return; // لا تنفذ إذا لم يكن هناك userId

  axios.get(`auth/user/${userId}`)
    .then((res) => {
      const { username, email, phone, role } = res.data;
      setProfile({
        name: username,
        email,
        phone,
        jobTitle: role || "",
        image: localStorage.getItem("profileImage") || "",
      });
      setName(username);
      setImage(localStorage.getItem("profileImage") || "");
    })
    .catch((err) => {
      toast.error("حدث خطأ أثناء تحميل البيانات", { position: "top-center" });
      console.error(err);
    });
}, [userId]);


  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setIsModified(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem("profileImage", reader.result);
        setProfile((prev) => ({ ...prev, image: reader.result }));
        setImage(reader.result);
        setIsModified(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ تحديث بيانات المستخدم
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      username: profile.name,
      email: profile.email,
      phone: profile.phone,
      role: profile.jobTitle,
    };

    const res = await axios.put(`auth/update/${userId}`, payload);
    console.log("Response:", res.data); // اختياري للتاكد

    toast.success("✅ تم حفظ البيانات بنجاح", {
      position: "top-center",
    });

    setName(profile.name);
    setIsEditable(false);
    setIsModified(false);
  } catch (err) {
    toast.error("❌ فشل حفظ البيانات", { position: "top-center" });
    console.error("Error updating profile:", err.response?.data || err.message);
  }
};


  const handleEdit = () => {
    setIsEditable(true);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">الملف الشخصي</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <div className="flex flex-col items-center">
          <label htmlFor="imageUpload" className="cursor-pointer">
            <img
              src={profile.image || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border mb-2"
            />
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="الاسم الكامل"
            className="border p-2 rounded"
            disabled={!isEditable}
          />
          <input
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="البريد الإلكتروني"
            className="border p-2 rounded"
            disabled={!isEditable}
          />
          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="رقم الهاتف"
            className="border p-2 rounded"
            disabled={!isEditable}
          />
          <input
            name="jobTitle"
            value={profile.jobTitle}
            onChange={handleChange}
            placeholder="المسمى الوظيفي"
            className="border p-2 rounded"
            disabled={!isEditable}
          />
        </div>

        {!isEditable ? (
          <button
            type="button"
            onClick={handleEdit}
            className="bg-green-600 text-white py-2 px-4 rounded"
          >
            تعديل الملف الشخصي
          </button>
        ) : (
          isModified && (
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
              حفظ التعديلات
            </button>
          )
        )}
      </form>
    </div>
  );
}
