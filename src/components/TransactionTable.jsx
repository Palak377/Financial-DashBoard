import { useState, useRef, useEffect } from "react";
import Papa from "papaparse"; 
import { useApp } from "../context/AppContext";

export default function TransactionTable() {
  const { transactions, filter, search, deleteTransaction, addTransaction, role } = useApp();
  
  const [sortBy, setSortBy] = useState("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const fileInputRef = useRef(null);

  // Filter Logic
  const filtered = transactions.filter(t => {
    const tDate = new Date(t.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesSearch = t.category.toLowerCase().includes(search.toLowerCase()) || 
                          t.type.toLowerCase().includes(search.toLowerCase());
    const matchesType = filter === "all" || t.type === filter;
    const matchesStartDate = !start || tDate >= start;
    const matchesEndDate = !end || tDate <= end;

    return matchesSearch && matchesType && matchesStartDate && matchesEndDate;
  });

  // Sorting Logic
  const sortedTransactions = [...filtered].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
    if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
    if (sortBy === "high") return b.amount - a.amount;
    if (sortBy === "low") return a.amount - b.amount;
    return 0;
  });

  // Export CSV
  const exportToCSV = () => {
    const headers = ["Date", "Category", "Type", "Amount"];
    const rows = sortedTransactions.map(t => [
      new Date(t.date).toLocaleDateString('en-IN'),
      t.category,
      t.type,
      t.amount
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  // Import CSV
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row) => {
          addTransaction({
            id: Date.now() + Math.random(),
            date: row.Date || new Date().toISOString().split('T')[0],
            category: row.Category || "Miscellaneous",
            type: row.Type?.toLowerCase() === "income" ? "income" : "expense",
            amount: parseFloat(row.Amount) || 0,
          });
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Recent Transactions</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{filtered.length} Records Found</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <input type="file" accept=".csv" ref={fileInputRef} onChange={handleImport} className="hidden" />
            <button onClick={() => fileInputRef.current.click()} className="bg-white/5 hover:bg-white/10 text-emerald-400 text-xs font-bold px-4 py-2 rounded-xl border border-white/10 transition-all">Import CSV</button>
            <button onClick={exportToCSV} className="bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold px-4 py-2 rounded-xl border border-white/10 transition-all">Export CSV</button>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-[10px] font-bold p-1 outline-none dark:text-white" />
            <span className="text-gray-400 text-xs">to</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-[10px] font-bold p-1 outline-none dark:text-white" />
          </div>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-xs font-bold text-indigo-500 outline-none cursor-pointer">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="high">Highest</option>
            <option value="low">Lowest</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-gray-200 dark:border-white/10">
        <table className="w-full text-left bg-white dark:bg-[#151921]">
          <thead className="bg-gray-50 dark:bg-white/5 text-[10px] uppercase text-gray-500 font-black">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Amount</th>
              {role === "Admin" && <th className="px-6 py-4 text-center">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {sortedTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                <td className="px-6 py-4"><span className="px-3 py-1 rounded-lg text-[10px] font-bold bg-gray-100 dark:bg-white/10">{t.category}</span></td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${t.type === "income" ? "bg-emerald-500" : "bg-rose-500"}`} />
                    <span className="text-xs capitalize font-semibold">{t.type}</span>
                  </div>
                </td>
                <td className={`px-6 py-4 text-right font-black ${t.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                   ₹{t.amount.toLocaleString("en-IN")}
                </td>
                {role === "Admin" && (
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => deleteTransaction(t.id)} className="text-gray-400 hover:text-rose-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
