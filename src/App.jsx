import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState , useEffect } from 'react';
import './index.css';
import "./i18n";

import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';

import GeneralLedger from './pages/ledger/GeneralLedger';
import CostCenters from './pages/costCenters/CostCenters';
import Reports from './pages/reports/Reports';

import FiscalYears from './pages/fiscal-years/FiscalYears';
import TrialBalance from './pages/Jourrnal/TrialBalance';
import BalanceSheet from './pages/Jourrnal/BalanceSheet';
import AccountsPage from './pages/accounts/AccountsPage';
import GroupsPage from './pages/accounts/GroupPage';
import TypesPage from './pages/accounts/TypePage';
import BranchPage from './pages/barnchs/BranchPage';
import Currencies from './pages/Currencies/Currencies';
import ProfilesPage from './pages/ProfilesPage';
import InvoicesList from './pages/invoicesList/InvoicesList';
import CreateInvoice from './pages/invoicesList/CreateInvoice';
import InvoiceDetails from './pages/invoicesList/CollectInvoice';
import InvoiceRefund from './pages/invoicesList/InvoiceRefund';
import { Toaster } from 'react-hot-toast';
import Agents from './pages/agents/Agents';
import JournalEntryForm from './pages/Jourrnal/JournalEntryForm';
import FinancialYearClose from './pages/fiscal-years/FinancialYearClose';
import OpeningBudget from './pages/budget/OpeningBudget';
import CompareBudgets from './pages/budget/CompareBudgets';
import CloseBudget from './pages/budget/CloseBudget';
import Journal from './pages/Jourrnal/Journal';
import InvoicePreviewPage from './InvoicePreviewPage/InvoicePreviewPage';
import CostCenterReport from './pages/reports/CostCenterReport';


export default function App() {
  const [lang, setLang] = useState('ar');
  const [username, setUsername] = useState('');
  const [isAppLoading, setIsAppLoading] = useState(true);

  const toggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // تحقق من الجلسة عند تحميل التطبيق
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('http://your-server.com/api/check-session', {
          method: 'GET',
          credentials: 'include', // إرسال الكوكيز مع الطلب
        });
        if (res.ok) {
          const data = await res.json();
          if (data.username) {
            setUsername(data.username);
          } else {
            setUsername('');
          }
        } else {
          setUsername('');
        }
      } catch (error) {
        setUsername('');
      } finally {
        setIsAppLoading(false);
      }
    }

    checkSession();
  }, []);

  if (isAppLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
          />
        </svg>
      </div>
    );
  }

  return (
    <Router>
      <Toaster
        position="top-left"
        toastOptions={{
          style: {
            padding: "12px 16px",
            fontSize: "16px",
            textAlign: "center",
          },
        }}
      />
      <Routes>
        {/* منع دخول صفحة تسجيل الدخول إذا كان مسجل دخول */}
        <Route
          path="/login"
          element={username ? <Navigate to="/" /> : <Login lang={lang} setUsername={setUsername} />}
        />
        <Route
          path="/forgot-password"
          element={username ? <Navigate to="/" /> : <ForgotPassword lang={lang} />}
        />

        {username ? (
          <Route
            path="/"
            element={
              <DashboardLayout
                lang={lang}
                toggleLang={toggleLang}
                username={username}
                setUsername={setUsername}
              />
            }
          >
            <Route path="/" element={<Dashboard lang={lang} />} />
            <Route path="/journal" element={<Journal lang={lang} />} />
            <Route path="/journal-form" element={<JournalEntryForm lang={lang} />} />
            <Route path="/accounts/accounts" element={<AccountsPage />} />
            <Route path="/accounts/groups" element={<GroupsPage />} />
            <Route path="/accounts/types" element={<TypesPage />} />
            <Route path="/Invoices" element={<InvoicesList />} />
            <Route path="/collect-invoice" element={<InvoiceDetails />} />
            <Route path="/invoice" element={<CreateInvoice />} />
            <Route path="/invoice/preview/:id" element={<InvoicePreviewPage />} />
            <Route path="/invoice-refund" element={<InvoiceRefund />} />
            <Route path="/branch" element={<BranchPage />} />
            <Route path="/ledger" element={<GeneralLedger />} />
            <Route path="/Currency" element={<Currencies />} />
            <Route path="/costcenter" element={<CostCenters />} />
            <Route path="/profile" element={<ProfilesPage />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/opening-budget" element={<OpeningBudget />} />
            <Route path="/compare-budget" element={<CompareBudgets />} />
            <Route path="/close-budget" element={<CloseBudget />} />
            <Route path="/reports" element={<Reports lang={lang} />} />
            <Route path="/cost-center-report" element={<CostCenterReport/>} />
            <Route path="/fiscal-years" element={<FiscalYears lang={lang} />} />
            <Route path="/fiscal-years-close" element={<FinancialYearClose lang={lang} />} />
            <Route path="/trial-balance" element={<TrialBalance lang={lang} />} />
            <Route path="/balance-sheet" element={<BalanceSheet lang={lang} />} />
          </Route>
        ) : (
          // إذا لم يكن مسجل دخول، كل طلب يتم تحويله إلى صفحة تسجيل الدخول
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}
