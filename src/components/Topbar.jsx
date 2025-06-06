import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LogOut, ChevronDown, User, Globe, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../../src/service/axios"

export default function Topbar({ onToggleSidebar }) {
  const { t, i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    const fetchUser = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await axios.get(`auth/user/${userId}`);
        setUsername(res.data.username);
        // setImage(res.data.image); // إذا أردت عرض صورة لاحقًا
      } catch (err) {
        console.error("فشل جلب بيانات المستخدم:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.body.classList.remove("rtl", "ltr");
    document.body.classList.add(isRTL ? "rtl" : "ltr");

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [i18n.language]);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar");
  };

  const handleProfile = () => {
    navigate("/profile");
    setDropdownOpen(false);
  };

  return (
    <header className="flex items-center justify-between bg-gradient-to-b from-blue-50 to-white shadow px-4 py-3 relative z-50">
      <div className="md:hidden">
        <button onClick={onToggleSidebar} className="text-blue-800 hover:text-blue-600 transition">
          <Menu size={24} />
        </button>
      </div>

      <div
        className={`flex items-center gap-3 cursor-pointer relative ${isRTL ? "ml-auto" : "mr-auto"}`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        ref={dropdownRef}
      >
        <span className="font-semibold text-gray-800 whitespace-nowrap">{username}</span>
        <ChevronDown size={16} />

        {dropdownOpen && (
          <div
            className={`absolute top-14 w-48 bg-white border rounded-lg shadow-md py-2 z-50 ${
              isRTL ? "left-0" : "right-0"
            }`}
          >
            <button
              onClick={handleProfile}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
            >
              <User size={16} /> {t("User Profile")}
            </button>
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
            >
              <Globe size={18} />
              {i18n.language === "ar" ? "English" : "العربية"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut size={16} /> {t("Logout")}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
