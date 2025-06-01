import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard, Settings, FileBarChart, RefreshCw, ChevronDown, ChevronUp,
  Book, Briefcase, Calendar, Users, FolderKanban, ListOrdered, Layers3,
  PlusCircle, Lock, FileText, BarChart4, ScrollText, Receipt, CircleDollarSign,
  RotateCcw, ListChecks, PencilLine, Building, Coins, Landmark, Menu, X
} from "lucide-react";

export default function Sidebar({ lang, isOpen, onClose }) {
  const { t } = useTranslation();8989087897687897989
  const isLTR = lang === "en";
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      to: "/dashboard",
    },
    {
      id: "setup",
      icon: Settings,
      submenu: [
        {
          id: "accounts",
          icon: Book,
          submenu: [
            { id: "accounts", icon: FolderKanban, to: "accounts/accounts" },
            { id: "account-types", icon: ListOrdered, to: "/accounts/types" },
            { id: "account-groups", icon: Layers3, to: "/accounts/groups" },
          ],
        },
        {
          id: "opening-budget",
          icon: Briefcase,
          submenu: [
            { id: "budget", icon: FileText, to: "/opening-budget" },
            { id: "compare-budget", icon: BarChart4, to: "/compare-budget" },
            { id: "close-budget", icon: Lock, to: "/close-budget" },
          ],
        },
        {
          id: "fiscal-years",
          icon: Calendar,
          submenu: [
            { id: "fiscal-create", icon: PlusCircle, to: "/fiscal-years" },
            { id: "fiscal-close", icon: Lock, to: "/fiscal-years-close" },
          ],
        },
        { id: "branches", icon: Building, to: "/branch" },
        { id: "currency", icon: Coins, to: "/Currency" },
        { id: "cost-center", icon: Landmark, to: "/costcenter" },
        { id: "agents", icon: Users, to: "/agents" },
      ],
    },
    {
      id: "reports",
      icon: FileBarChart,
      submenu: [
        { id: "profit-reports", icon: BarChart4, to: "/reports" },
        { id: "balance-sheet", icon: FileText, to: "/balance-sheet" },
        { id: "trial-balance", icon: ScrollText, to: "/trial-balance" },
        { id: "ledger", icon: ListChecks, to: "/ledger" },
        { id: "cost-center-report", icon: Landmark, to: "/cost-center-report" },
      ],
    },
    {
      id: "operations",
      icon: RefreshCw,
      submenu: [
        {
          id: "invoices",
          icon: Receipt,
          submenu: [
            { id: "create-invoice", icon: PlusCircle, to: "/invoice" },
            { id: "collect-invoice", icon: CircleDollarSign, to: "/collect-invoice" },
            { id: "invoice-refund", icon: RotateCcw, to: "/invoice-refund" },
          ],
        },
        {
          id: "journal-entries",
          icon: ListChecks,
          submenu: [
            { id: "entries", icon: ListOrdered, to: "/journal" },
            { id: "create-entry", icon: PencilLine, to: "/journal-form" },
          ],
        },
      ],
    },
  ];

  const renderItem = (item, depth = 0) => {
    const hasSub = !!item.submenu;
    const isOpen = openMenus[item.id];
    const paddingDir = isLTR ? `ps-${depth * 4}` : `pe-${depth * 4}`;

    const itemClasses = `flex items-center justify-between py-2 px-3 cursor-pointer hover:bg-blue-100 rounded-md transition duration-200 ${paddingDir}`;

    const content = (
      <div className={itemClasses}>
        <div className="flex items-center gap-3">
          <item.icon className="text-blue-600 w-5 h-5" />
          <span className="text-sm font-medium">{t(`menu.${item.id}`)}</span>
        </div>
        {hasSub && (isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />)}
      </div>
    );

    return (
      <li key={item.id} className="transition-all">
        {hasSub ? (
          <div onClick={() => toggleMenu(item.id)}>{content}</div>
        ) : item.to ? (
          <Link to={item.to} onClick={onClose} className="no-underline">{content}</Link>
        ) : (
          <div>{content}</div>
        )}
        {hasSub && isOpen && (
          <ul className={`mt-1 space-y-1 border-blue-200 ps-2 ${isLTR ? "border-s-2" : "border-e-2"}`}>
            {item.submenu.map((sub) => renderItem(sub, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      {/* زر القائمة للشاشات الصغيرة */}
      <button
        className={`md:hidden fixed top-4 z-50 ${isLTR ? "right-4" : "left-4"} bg-blue-600 text-white p-2 rounded-md`}
        onClick={onClose}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* السايدبار */}
      <div
        className={`fixed top-0 h-full z-40 transform transition-transform duration-300 ease-in-out bg-white shadow-lg w-64 p-4 overflow-y-auto
        ${isLTR ? "left-0" : "right-0"}
        ${isOpen ? "translate-x-0" : isLTR ? "-translate-x-full" : "translate-x-full"}
        md:relative md:translate-x-0 md:block`}
      >
        <h2 className="font-bold text-blue-700 mb-4 text-center text-2xl">
          {t("menu.Accounting System")}
        </h2>
        <ul className="space-y-1">{menuItems.map((item) => renderItem(item))}</ul>
      </div>
    </>
  );
}
