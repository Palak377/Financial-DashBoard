
import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function TransactionTable() {
  const { transactions, filter, search, deleteTransaction, role } = useApp();
  
  // 1. Add sort state
  const [sortBy, setSortBy] = useState("newest");

  // 2. Filter Logic
  const filtered = transactions.filter(t =>
    (filter === "all" || t.type === filter) &&
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  // 3. Sort Logic (New)
  const sortedTransactions = [...filtered].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
    if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
    if (sortBy === "high") return b.amount - a.amount;
    if (sortBy === "low") return a.amount - b.amount;
    return 0;
  });

  if (filtered.length === 0) {
    return (
      <div className="p-10 text-center bg-white/50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/10">
        <p className="text-gray-500 dark:text-gray-400 font-medium">No transactions found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Header & Sort Dropdown */}
      <div className="flex justify-between items-end mb-2 px-1">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">All Transactions</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">History & Logs</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase">Sort By</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-sm font-bold text-emerald-600 dark:text-emerald-400 outline-none cursor-pointer border-b-2 border-transparent hover:border-emerald-500/30 transition-all"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="high">Highest Amount</option>
            <option value="low">Lowest Amount</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-2xl">
        <table className="w-full text-left border-collapse bg-white dark:bg-white/5 backdrop-blur-md">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-widest font-bold">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Amount</th>
              {role === "Admin" && <th className="px-6 py-4 text-center">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {/* Map over sortedTransactions instead of filtered */}
            {sortedTransactions.map((t) => (
              <tr 
                key={t.id} 
                className="hover:bg-indigo-50/30 dark:hover:bg-white/5 transition-colors duration-200 group"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${t.type === "income" ? "bg-emerald-500" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"}`} />
                    <span className="text-sm capitalize font-medium text-gray-700 dark:text-gray-300">{t.type}</span>
                  </div>
                </td>
                <td className={`px-6 py-4 text-right font-bold tabular-nums ${
                  t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}>
                  {t.type === "income" ? "+" : "-"} ₹{t.amount.toLocaleString("en-IN")}
                </td>
                
                {role === "Admin" && (
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => deleteTransaction(t.id)} 
                      className="p-2 text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-all duration-200 active:scale-90"
                      title="Delete Transaction"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
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
