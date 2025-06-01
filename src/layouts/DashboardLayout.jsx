import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ toggleLang, lang, username }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isRTL = lang === "ar";

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // إغلاق السايدبار عند الضغط خارج القائمة
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isSidebarOpen &&
        !e.target.closest(".mobile-sidebar") &&
        !e.target.closest(".menu-button")
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen relative overflow-hidden">
      {/* ✅ Sidebar دائم في الشاشات الكبيرة */}
      <div className="hidden md:block">
        <Sidebar lang={lang} />
      </div>

      {/* ✅ زر القائمة (Menu) في الشاشات الصغيرة */}
      <button
        className={`menu-button md:hidden fixed top-4 z-50 ${
          isRTL ? "left-4" : "right-4"
        } bg-blue-600 text-white p-2 rounded-md`}
        onClick={handleSidebarToggle}
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* ✅ Sidebar متحرك في الشاشات الصغيرة */}
      <div
        className={`fixed top-0 h-full z-40 transform transition-transform duration-300 ease-in-out bg-white shadow-lg w-64 p-4 overflow-y-auto mobile-sidebar
        ${isRTL ? "right-0" : "left-0"}
        ${isSidebarOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"}
        md:hidden`}
      >
        <Sidebar lang={lang} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* ✅ غطاء عند فتح السايدبار */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ✅ Main content */}
      <div className="flex-1 flex flex-col">
        <Topbar
          toggleLang={toggleLang}
          username={username}
          lang={lang}
          onToggleSidebar={handleSidebarToggle}
        />

       <main className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 overflow-x-hidden mt-14">
  <Outlet />
</main>

      </div>
    </div>
  );
}
