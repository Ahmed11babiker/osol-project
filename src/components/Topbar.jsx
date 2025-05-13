import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LogOut, ChevronDown, User, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // ✅ استيراد السياق

export default function Topbar({ onSidebarToggle }) {
  const { t, i18n } = useTranslation();
  const { name, image } = useUser(); // ✅ استخدام السياق
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Add smooth transition for direction change
    const changeDirection = () => {
      document.documentElement.classList.toggle("rtl", i18n.language === "ar");

      // Remove and add RTL/LTR classes on the body to apply smooth transition
      document.body.classList.remove("rtl", "ltr");
      document.body.classList.add(i18n.language === "ar" ? "rtl" : "ltr");
    };
    changeDirection();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [i18n.language]); // Watch for language change

  const handleLogout = () => {
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
    <header className="flex items-center justify-between bg-white shadow px-4 py-3">
      {/* Sidebar toggle button for mobile */}
      <button onClick={onSidebarToggle} className="md:hidden text-2xl">
        ☰
      </button>

      <div className="flex items-center gap-4">
        <div
          className="relative cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          ref={dropdownRef}
        >
          <div className="flex items-center gap-2">
            {image && (
              <img
                src={image}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border"
              />
            )}
            <span className="font-semibold text-gray-700">{name}</span>
            <ChevronDown size={16} />
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
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
      </div>
    </header>
  );
}
