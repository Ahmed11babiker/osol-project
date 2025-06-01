import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { useState } from 'react';
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
import TrialBalance from './pages/TrialBalance/TrialBalance';
import BalanceSheet from './pages/BalanceSheet/BalanceSheet';
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

import FinancialYearClose from './pages/fiscal-years/FinancialYearClose';
import OpeningBudget from './pages/budget/OpeningBudget';
import CompareBudgets from './pages/budget/CompareBudgets';
import CloseBudget from './pages/budget/CloseBudget';
import Journal from './pages/Jourrnal/Journal'
import JournalForms from './pages/Jourrnal/JournalForms'

import CostCenterReport from './pages/reports/CostCenterReport';

export default function App() {
  const [lang, setLang] = useState('ar');
  const toggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  return (
    <CookiesProvider>
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
        {/* صفحة تسجيل الدخول متاحة دائماً */}
        <Route path="/login" element={<Login lang={lang} setUsername={() => {}} />} />
        <Route path="/forgot-password" element={<ForgotPassword lang={lang} />} />

        {/* جميع صفحات النظام متاحة بدون تحقق */}
        <Route
          path="/"
          element={
            <DashboardLayout
              lang={lang}
              toggleLang={toggleLang}
              username={''}  // يمكن تركها فارغة
              setUsername={() => {}}
            />
          }
        >
          <Route path="/" element={<Login lang={lang} />} />
          <Route path="/login" element={<Login lang={lang} />} />
          <Route path="/dashboard" element={<Dashboard lang={lang} />} />
          <Route path="/journal" element={<Journal lang={lang} />}/>
          <Route path="/journal-form" element={<JournalForms lang={lang} />} />
          <Route path="/accounts/accounts" element={<AccountsPage />} />
          <Route path="/accounts/groups" element={<GroupsPage />} />
          <Route path="/accounts/types" element={<TypesPage />} />
          <Route path="/Invoices" element={<InvoicesList />} />
          <Route path="/collect-invoice" element={<InvoiceDetails />} />
          <Route path="/invoice" element={<CreateInvoice />} />
        
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
          <Route path="/cost-center-report" element={<CostCenterReport />} />
          <Route path="/fiscal-years" element={<FiscalYears lang={lang} />} />
          <Route path="/fiscal-years-close" element={<FinancialYearClose lang={lang} />} />
          <Route path="/trial-balance" element={<TrialBalance lang={lang} />} />
          <Route path="/balance-sheet" element={<BalanceSheet lang={lang} />} />
        </Route>

        {/* أي مسار غير معروف يظهر صفحة تسجيل الدخول (أو يمكن تغييره لأي صفحة أخرى) */}
        <Route path="*" element={<Login lang={lang} setUsername={() => {}} />} />
      </Routes>
    </Router>
    </CookiesProvider>
  );
}
