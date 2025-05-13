// 📁 src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Book, ChevronDown, ChevronRight, Home, ClipboardList, BarChart2, DollarSign, FileText, Calendar, Users, Globe } from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isInvoicesOpen, setIsInvoicesOpen] = useState(false);

  const links = [
    { to: "/", label: "Dashboard", icon: <Home size={16} /> },
    { to: "/reports", label: "Reports", icon: <BarChart2 size={16} /> },
    { to: "/branch", label: "Branch", icon: <Users size={16} /> },
    { to: "/currency", label: "Currencies", icon: <DollarSign size={16} /> },
    { to: "/costcenter", label: "CostCenter", icon: <DollarSign size={16} /> }
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 768) onClose();
  };

  const sidebarClass = isOpen
    ? "translate-x-0"
    : "-translate-x-full md:translate-x-0";

  return (
    <aside className={`fixed md:static top-0 left-0 z-40 h-full w-64 bg-blue-900 text-white transform ${sidebarClass} transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-hide`}>
      <div className="p-4 border-b border-blue-700 flex justify-between items-center md:hidden">
        <h2 className="text-xl font-bold">{t("Accounting System")}</h2>
        <button onClick={onClose} className="text-white text-xl">✖</button>
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-bold border-b pb-2 text-center">{t("Accounting System")}</h2>
        <nav className="flex flex-col gap-3">

          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-5 px-4 py-2 rounded transition-all duration-200 ${
                  isActive ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-200 hover:text-black"
                }`
              }
            >
              {icon}
              <span>{t(label)}</span>
            </NavLink>
          ))}

          {/* Journal Entries Dropdown */}
          <button
            onClick={() => setIsJournalOpen(!isJournalOpen)}
            className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-200 hover:text-black transition-all duration-200"
          >
            <div className="flex items-center gap-5">
              <ClipboardList size={16} />
              <span>{t("Journal Entries")}</span>
            </div>
            {isJournalOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isJournalOpen && (
            <div className="ml-6 flex flex-col gap-1">
              <NavLink to="/journal" onClick={handleLinkClick} className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-2 rounded text-sm ${
                  isActive ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-200 hover:text-black"
                }`}>
                <ClipboardList size={14} />
                {t("Entries")}
              </NavLink>
              <NavLink to="/ledger" onClick={handleLinkClick} className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-2 rounded text-sm ${
                  isActive ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-200 hover:text-black"
                }`}>
                <Book size={14} />
                {t("General Ledger")}
              </NavLink>
              <NavLink to="/trial-balance" onClick={handleLinkClick} className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-2 rounded text-sm ${
                  isActive ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-200 hover:text-black"
                }`}>
                <FileText size={14} />
                {t("Trial Balance")}
              </NavLink>
              <NavLink to="/balance-sheet" onClick={handleLinkClick} className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-2 rounded text-sm ${
                  isActive ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-200 hover:text-black"
                }`}>
                <Calendar size={14} />
                {t("Balance Sheet")}
              </NavLink>
            </div>
          )}

          {/* Accounts Tree Dropdown */}
          <button
            onClick={() => setIsAccountsOpen(!isAccountsOpen)}
            className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-200 hover:text-black transition-all duration-200"
          >
            <div className="flex items-center gap-5">
              <Globe size={16} />
              <span>{t("Accounts Tree")}</span>
            </div>
            {isAccountsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isAccountsOpen && (
            <div className="ml-6 flex flex-col gap-1">
              <NavLink to="/accounts/accounts" onClick={handleLinkClick} className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-2 rounded text-sm ${
                  isActive ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-200 hover:text-black"
                }`}>
                <ClipboardList size={14} />
                {t("Accounts")}
              </NavLink>
              <NavLink to="/accounts/groups" onClick={handleLinkClick} className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-2 rounded text-sm ${
                  isActive ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-200 hover:text-black"
                }`}>
                <Users size={14} />
                {t("Account Groups")}
              </NavLink>
              <NavLink to="/accounts/types" onClick={handleLinkClick} className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-2 rounded text-sm ${
                  isActive ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-200 hover:text-black"
                }`}>
                <BarChart2 size={14} />
                {t("Account Types")}
              </NavLink>
            </div>
          )}

          {/* Invoices Dropdown */}
          <button
            onClick={() => setIsInvoicesOpen(!isInvoicesOpen)}
            className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-200 hover:text-black transition-all duration-200"
          >
            <div className="flex items-center gap-5">
              <FileText size={16} />
              <span>{t("Invoices")}</span>
            </div>
            {isInvoicesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isInvoicesOpen && (
            <div className="ml-6 flex flex-col gap-1">
              <NavLink to="/create-invoice" onClick={handleLinkClick} className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-2 rounded text-sm ${
                  isActive ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-200 hover:text-black"
                }`}>
                <ClipboardList size={14} />
                {t("Create Invoice")}
              </NavLink>
              <NavLink to="/collect-invoice" onClick={handleLinkClick} className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-2 rounded text-sm ${
                  isActive ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-200 hover:text-black"
                }`}>
                <DollarSign size={14} />
                {t("Collect Invoice")}
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}
