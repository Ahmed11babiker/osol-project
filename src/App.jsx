// ✅ المرحلة الأولى: الهيكل الأساسي للمشروع

// import { BrowserRouter as Router, Routes, Route ,Navigate } from 'react-router-dom';
// import { useState } from 'react';
// import './index.css';

// // ✅ استيراد المكونات من المجلدات الجديدة
// import Sidebar from './components/Sidebar';
// import Topbar from './components/Topbar';
// import Placeholder from './components/Placeholder';

// // ✅ استيراد الصفحات
// import Dashboard from './pages/Dashboard';
// import JournalEntries from './pages/JournalEntries';
// import AccountsTree from './pages/AccountsTree';
// import Reports from './pages/Reports';
// import FiscalYears from './pages/FiscalYears';
// import Login from './pages/Login';
// import ForgotPassword from './pages/ForgotPassword';
// import TrialBalance from './pages/TrialBalance';
// import BalanceSheet from './pages/BalanceSheet';

// export default function App() {
//   const [lang, setLang] = useState('ar');
//   const [username, setUsername] = useState('');
//   const toggleLang = () => {
//     setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
//   };
//   // const toggleLang = () => setLang(lang === 'ar' ? 'en' : 'ar');
//   // const [username, setUsername] = useState('');
//   return (
//     <Router>
//          <Routes>
//          <Route path="/login" element={<Login lang={lang} setUsername={setUsername} />} />
//           <Route path="/forgot-password" element={<ForgotPassword lang={lang} />} />

//         {username ? (
//           <>
//             <Route path="/" element={<Dashboard lang={lang} />} />
//             <Route path="/journal" element={<JournalEntries lang={lang} />} />
//             <Route path="/accounts" element={<AccountsTree lang={lang} />} />
//             <Route path="/reports" element={<Reports lang={lang} />} />
//             <Route path="/fiscal-years" element={<FiscalYears lang={lang} />} />
//             <Route path="/trial-balance" element={<TrialBalance lang={lang} />} />
//             <Route path="/balance-sheet" element={<BalanceSheet lang={lang} />} />
//           </>
//         ) : (
//           <Route path="*" element={<Navigate to="/login" />} />
//         )}
//       </Routes>
//     </Router>
//   );
// }


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState , useEffect } from 'react';
import './index.css';

import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import JournalEntries from './pages/Jourrnal/JournalEntries';
import GeneralLedger from './pages/Jourrnal/GeneralLedger';
import CostCenters from './pages/costCenters/CostCenters';
import AccountsTree from './pages/accounts/AccountsTree';
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
import { Toaster } from 'react-hot-toast';
export default function App() {
  const [lang, setLang] = useState('ar');
  const [username, setUsername] = useState('');
  const [isAppLoading, setIsAppLoading] = useState(true);
  const toggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
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
        position="top-left" // يمكنك استخدام "bottom-center" أيضاً
        toastOptions={{
          style: {
            padding: "12px 16px",
            fontSize: "16px",
            textAlign: "center",
          },
        }}
      />
      <Routes>
         
        <Route path="/login" element={<Login lang={lang} setUsername={setUsername} />} />
        <Route path="/forgot-password" element={<ForgotPassword lang={lang} />} />
        
        {username ? (
          <Route path="/" element={<DashboardLayout lang={lang} toggleLang={toggleLang} username={username} />}
          >
            
            <Route path='/' element={<Dashboard lang={lang} />} />
            <Route path="/journal" element={<JournalEntries lang={lang} />} />
            <Route path="/accounts" element={<AccountsTree lang={lang} />} />
            <Route path="/accounts/accounts" element={<AccountsPage />} />
            <Route path="/accounts/groups" element={<GroupsPage />} />
            <Route path="/accounts/types" element={<TypesPage />} />

            <Route path="/Invoices" element={<InvoicesList />} />
            <Route path="/collect-invoice" element={<InvoiceDetails />} />
            <Route path="/create-invoice" element={<CreateInvoice />} />

            <Route path="/branch" element={<BranchPage />} />
            <Route path="/ledger" element={< GeneralLedger/>} />
            <Route path="/Currency" element={<Currencies />} />
            <Route path="/costcenter" element={<CostCenters />} />
            <Route path="/profile" element={<ProfilesPage />} />

            <Route path="/reports" element={<Reports lang={lang} />} />
            <Route path="/fiscal-years" element={<FiscalYears lang={lang} />} />
            <Route path="/trial-balance" element={<TrialBalance lang={lang} />} />
            <Route path="/balance-sheet" element={<BalanceSheet lang={lang} />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}








// // ✅ المرحلة الأولى: الهيكل الأساسي للمشروع

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useState } from 'react';
// import './index.css';

// // ✅ استيراد المكونات من المجلدات الجديدة
// import Sidebar from './components/Sidebar';
// import Topbar from './components/Topbar';
// import Placeholder from './components/Placeholder';

// // ✅ استيراد الصفحات (لاحقًا يمكن بناءها كاملة)
// import Dashboard from './pages/Dashboard';
// import JournalEntries from './pages/JournalEntries';
// import AccountsTree from './pages/AccountsTree';
// import Reports from './pages/Reports';
// import FiscalYears from './pages/FiscalYears';
// import Login from './pages/Login';
// import ForgotPassword from './pages/ForgotPassword';
// import TrialBalance from './pages/TrialBalance';
// import BalanceSheet from './pages/BalanceSheet';

// export default function App() {
//   const [lang, setLang] = useState('ar');
//   const toggleLang = () => setLang(lang === 'ar' ? 'en' : 'ar');

//   return (
//     <Router>
//       <div className="flex">
//         <Sidebar toggleLang={toggleLang} lang={lang} />
//         <div className="flex-1">
//           <Topbar lang={lang} />
//           <Routes>
//             <Route path="/" element={<Dashboard lang={lang} />} />
//             <Route path="/journal" element={<JournalEntries lang={lang} />} />
//             <Route path="/accounts" element={<AccountsTree lang={lang} />} />
//             <Route path="/reports" element={<Reports lang={lang} />} />
//             <Route path="/fiscal-years" element={<FiscalYears lang={lang} />} />
//             <Route path="/login" element={<Login lang={lang} />} />
//             <Route path="/forgot-password" element={<ForgotPassword lang={lang} />} />
//             <Route path="/trial-balance" element={<TrialBalance lang={lang} />} />
//             <Route path="/balance-sheet" element={<BalanceSheet lang={lang} />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }
