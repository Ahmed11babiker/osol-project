// 📁 src/pages/journal/JournalEntries.jsx
import { useState } from "react";
import JournalHeader from "./JournalHeader";
import JournalEntryForm from "./JournalEntryForm";
import JournalDetails from "./JournalDetails";
import FiscalYearForm from "../../components/FiscalYearForm";
const JournalEntries = ({ lang }) => {
  const [header, setHeader] = useState({ date: "", description: "", fiscalYearId: "" });
  const [lines, setLines] = useState([]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">📔 قيود اليومية</h2>
      <FiscalYearForm/>
      <JournalHeader header={header} setHeader={setHeader} />
      <JournalEntryForm lines={lines} setLines={setLines} />
      <JournalDetails lines={lines} />
      
    </div>
  );
};

export default JournalEntries;



