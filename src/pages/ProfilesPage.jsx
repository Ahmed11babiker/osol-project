import { useEffect, useState } from "react";
import { toast } from "react-hot-toast"; // ✅ استيراد toast
import { useUser } from "../context/UserContext"; // ✅ استيراد السياق

export default function ProfilePage() {
  const { setName, setImage } = useUser(); // ✅ استخدام السياق
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    image: "",
  });
  const [isEditable, setIsEditable] = useState(false);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("profileName") || "";
    const storedEmail = localStorage.getItem("profileEmail") || "";
    const storedPhone = localStorage.getItem("profilePhone") || "";
    const storedJobTitle = localStorage.getItem("profileJobTitle") || "";
    const storedImage = localStorage.getItem("profileImage") || "";
    setProfile({
      name: storedName,
      email: storedEmail,
      phone: storedPhone,
      jobTitle: storedJobTitle,
      image: storedImage,
    });
  }, []);

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
        setImage(reader.result); // ✅ تحديث الصورة في السياق
        setIsModified(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("profileName", profile.name);
    localStorage.setItem("profileEmail", profile.email);
    localStorage.setItem("profilePhone", profile.phone);
    localStorage.setItem("profileJobTitle", profile.jobTitle);

    setName(profile.name); // ✅ تحديث الاسم في السياق
    toast.success("✅ تم حفظ البيانات بنجاح", {
      position: "top-center",
    });

    setIsModified(false);
    setIsEditable(false);
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
