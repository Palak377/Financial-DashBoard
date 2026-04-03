import { useState } from "react";
import Navbar from "../components/Navbar";
import SummaryCard from "../components/summarycard";
import TransactionTable from "../components/TransactionTable";
import Filters from "../components/Filters";
import Charts from "../components/Charts";
import Insights from "../components/Insights";
import TransactionForm from "../components/TransactionForm";
import ReportsView from "./ReportsView"; 
import { useApp } from "../context/AppContext";
import { calculateSummary } from "../utils/helper";

export default function Dashboard() {
  const { transactions, addTransaction, role } = useApp();
  const { income, expense, balance } = calculateSummary(transactions);
  
  // 1. Calculate Savings Rate
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  // 2. Data Logic for Full Category Breakdown (Matches Screenshot 37)
  const expenseMap = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
    }
  });

  // Sort by amount descending and identify the top expense for progress bar scaling
  const categories = Object.entries(expenseMap).sort((a, b) => b[1] - a[1]);
  const topAmount = categories[0]?.[1] || 1; 

  const [dark, setDark] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F17] transition-colors duration-300 text-gray-900 dark:text-white">
        
        <Navbar 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          dark={dark} 
          setDark={setDark} 
        />

        <main className="max-w-7xl mx-auto p-6 md:p-10">
          
          {/* VIEW 1: DASHBOARD */}
          {currentView === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black tracking-tight">Overview</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back, here is your summary.</p>
                </div>
                {role === "Admin" && (
                  <button onClick={() => setIsAdding(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95">
                    ＋ Add Transaction
                  </button>
                )}
              </div>

              {/* Grid updated to 4 columns to include Savings Rate (Screenshot 34) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard title="Net Balance" value={balance} />
                <SummaryCard title="Total Income" value={income} />
                <SummaryCard title="Total Expense" value={expense} />
                <SummaryCard title="Savings Rate" value={Math.max(0, savingsRate)} />
              </div>

              <Charts />

              {/* Full Category Breakdown Section (Matches Screenshot 37) */}
              <div className="bg-white dark:bg-[#151921] p-8 rounded-[2.5rem] border border-gray-200 dark:border-white/5 shadow-2xl mt-8">
                <h3 className="text-xl font-bold mb-8">Full Category Breakdown</h3>
                <div className="space-y-7">
                  {categories.map(([cat, amt], index) => {
                    const percentage = Math.round((amt / topAmount) * 100);
                    return (
                      <div key={cat} className="group flex items-center gap-5">
                        <span className="text-gray-500 text-xs w-4 font-mono font-bold">{index + 1}</span>
                        <div className={`w-2.5 h-2.5 rounded-full ${getCategoryColor(cat)}`} />
                        <span className="dark:text-gray-300 text-sm w-32 truncate font-semibold capitalize">{cat}</span>
                        
                        <div className="flex-1 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${getCategoryColor(cat)} opacity-80`} 
                            style={{ width: `${percentage}%` }} 
                          />
                        </div>
                        
                        <div className="text-right w-28">
                          <p className="font-black text-sm text-gray-900 dark:text-white">₹{amt.toLocaleString("en-IN")}</p>
                        </div>
                        <span className="text-gray-500 text-[11px] font-bold w-10 text-right">{percentage}%</span>
                      </div>
                    );
                  })}
                  {categories.length === 0 && (
                    <p className="text-center text-gray-500 py-10 italic">No expense data available for this period.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: TRANSACTIONS */}
          {currentView === "transactions" && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold">Transactions</h2>
              <div className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-xl">
                <Filters />
                <TransactionTable />
              </div>
            </div>
          )}

          {currentView === "reports" && <ReportsView />}

          {currentView === "insights" && (
            <div className="animate-in zoom-in-95 duration-500">
              <h2 className="text-3xl font-bold mb-8">Smart Insights</h2>
              <Insights />
            </div>
          )}

        </main>

        {isAdding && (
          <TransactionForm 
            onSave={(data) => { addTransaction(data); setIsAdding(false); }} 
            onCancel={() => setIsAdding(false)} 
          />
        )}
      </div>
    </div>
  );
}

// Helper for breakdown colors
function getCategoryColor(category) {
  const colors = {
    shopping: "bg-pink-500",
    travel: "bg-orange-400",
    food: "bg-blue-500",
    rent: "bg-teal-400",
    misc: "bg-purple-500",
    electricity: "bg-amber-400",
    games: "bg-sky-400",
    internet: "bg-emerald-400",
    movies: "bg-lime-400"
  };
  return colors[category.toLowerCase()] || "bg-indigo-500";
}
// import { useState } from "react";
// import Navbar from "../components/Navbar";
// import SummaryCard from "../components/summarycard";
// import TransactionTable from "../components/TransactionTable";
// import Filters from "../components/Filters";
// import Charts from "../components/Charts";
// import Insights from "../components/Insights";
// import TransactionForm from "../components/TransactionForm";
// import ReportsView from "./ReportsView"; // We'll create this below
// import { useApp } from "../context/AppContext";
// import { calculateSummary } from "../utils/helper";

// export default function Dashboard() {
//   const { transactions, addTransaction, role } = useApp();
//   const { income, expense, balance } = calculateSummary(transactions);
  
//   const [dark, setDark] = useState(true);
//   const [currentView, setCurrentView] = useState("dashboard");
//   const [isAdding, setIsAdding] = useState(false);

//   return (
//     <div className={dark ? "dark" : ""}>
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        
//         <Navbar 
//           currentView={currentView} 
//           setCurrentView={setCurrentView} 
//           dark={dark} 
//           setDark={setDark} 
//         />

//         <main className="max-w-7xl mx-auto p-6 md:p-10">
          
//           {/* VIEW 1: DASHBOARD */}
//           {currentView === "dashboard" && (
//             <div className="space-y-8 animate-in fade-in duration-500">
//               <div className="flex justify-between items-end">
//                 <div>
//                   <h1 className="text-3xl font-bold dark:text-white text-gray-900">Overview</h1>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, here is your summary.</p>
//                 </div>
//                 {role === "Admin" && (
//                   <button onClick={() => setIsAdding(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95">
//                     ＋ Add Transaction
//                   </button>
//                 )}
//               </div>
//               <div className="grid md:grid-cols-3 gap-6">
//                 <SummaryCard title="Total Balance" value={balance} />
//                 <SummaryCard title="Income" value={income} />
//                 <SummaryCard title="Expenses" value={expense} />
//               </div>
//               <Charts />
//             </div>
//           )}

//           {/* VIEW 2: TRANSACTIONS */}
//           {currentView === "transactions" && (
//             <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
//               <h2 className="text-3xl font-bold dark:text-white">Transactions</h2>
//               <div className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-xl">
//                 <Filters />
//                 <TransactionTable />
//               </div>
//             </div>
//           )}

//           {/* VIEW 3: REPORTS */}
//           {currentView === "reports" && <ReportsView />}

//           {/* VIEW 4: INSIGHTS */}
//           {currentView === "insights" && (
//             <div className="animate-in zoom-in-95 duration-500">
//               <h2 className="text-3xl font-bold dark:text-white mb-8">Smart Insights</h2>
//               <Insights />
//             </div>
//           )}

//         </main>

//         {isAdding && (
//           <TransactionForm 
//             onSave={(data) => { addTransaction(data); setIsAdding(false); }} 
//             onCancel={() => setIsAdding(false)} 
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import Navbar from "../components/Navbar";
// import SummaryCard from "../components/summarycard";
// import TransactionTable from "../components/TransactionTable";
// import Filters from "../components/Filters";
// import Charts from "../components/Charts";
// import Insights from "../components/Insights";
// import TransactionForm from "../components/TransactionForm";
// import ReportsView from "./ReportsView"; // We'll create this below
// import { useApp } from "../context/AppContext";
// import { calculateSummary } from "../utils/helper";

// export default function Dashboard() {
//   const { transactions, addTransaction, role } = useApp();
//   const { income, expense, balance } = calculateSummary(transactions);
  
//   const [dark, setDark] = useState(true);
//   const [currentView, setCurrentView] = useState("dashboard");
//   const [isAdding, setIsAdding] = useState(false);

//   return (
//     <div className={dark ? "dark" : ""}>
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        
//         <Navbar 
//           currentView={currentView} 
//           setCurrentView={setCurrentView} 
//           dark={dark} 
//           setDark={setDark} 
//         />

//         <main className="max-w-7xl mx-auto p-6 md:p-10">
          
//           {/* VIEW 1: DASHBOARD */}
//           {currentView === "dashboard" && (
//             <div className="space-y-8 animate-in fade-in duration-500">
//               <div className="flex justify-between items-end">
//                 <div>
//                   <h1 className="text-3xl font-bold dark:text-white text-gray-900">Overview</h1>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, here is your summary.</p>
//                 </div>
//                 {role === "Admin" && (
//                   <button onClick={() => setIsAdding(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95">
//                     ＋ Add Transaction
//                   </button>
//                 )}
//               </div>
//               <div className="grid md:grid-cols-3 gap-6">
//                 <SummaryCard title="Total Balance" value={balance} />
//                 <SummaryCard title="Income" value={income} />
//                 <SummaryCard title="Expenses" value={expense} />
//               </div>
//               <Charts />
//             </div>
//           )}

//           {/* VIEW 2: TRANSACTIONS */}
//           {currentView === "transactions" && (
//             <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
//               <h2 className="text-3xl font-bold dark:text-white">Transactions</h2>
//               <div className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-xl">
//                 <Filters />
//                 <TransactionTable />
//               </div>
//             </div>
//           )}

//           {/* VIEW 3: REPORTS */}
//           {currentView === "reports" && <ReportsView />}

//           {/* VIEW 4: INSIGHTS */}
//           {currentView === "insights" && (
//             <div className="animate-in zoom-in-95 duration-500">
//               <h2 className="text-3xl font-bold dark:text-white mb-8">Smart Insights</h2>
//               <Insights />
//             </div>
//           )}

//         </main>

//         {isAdding && (
//           <TransactionForm 
//             onSave={(data) => { addTransaction(data); setIsAdding(false); }} 
//             onCancel={() => setIsAdding(false)} 
//           />
//         )}
//       </div>
//     </div>
//   );
// }
