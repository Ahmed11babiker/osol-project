
// 📁 src/pages/fiscal-years/FiscalYears.jsx
import { useState } from "react";

import FiscalYearForm from "../../components/FiscalYearForm";
import FiscalYearList from "../../components/FiscalYearList";

const FiscalYears = ({ lang }) => {
  const [fiscalYears, setFiscalYears] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const handleSaveFiscalYear = (newFiscalYear) => {
    setFiscalYears([...fiscalYears, newFiscalYear]);
    setIsAdding(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">{lang === 'ar' ? "السنوات المالية" : "Fiscal Years"}</h2>
    

      {isAdding ? (
        <FiscalYearForm onSave={handleSaveFiscalYear} />
      ) : (
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsAdding(true)}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            إضافة سنة مالية جديدة
          </button>
        </div>
      )}
      <FiscalYearList fiscalYears={fiscalYears} />
   
    </div>
  );
};

export default FiscalYears;





