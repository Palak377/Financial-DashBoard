import { useState } from "react";
import Navbar from "../components/Navbar";
import SummaryCard from "../components/summarycard";
import TransactionTable from "../components/TransactionTable";
import Filters from "../components/Filters";
import Charts from "../components/Charts";
import Insights from "../components/Insights";
import TransactionForm from "../components/TransactionForm";
import ReportsView from "./ReportsView"; // We'll create this below
import { useApp } from "../context/AppContext";
import { calculateSummary } from "../utils/helper";

export default function Dashboard() {
  const { transactions, addTransaction, role } = useApp();
  const { income, expense, balance } = calculateSummary(transactions);
  
  const [dark, setDark] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        
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
                  <h1 className="text-3xl font-bold dark:text-white text-gray-900">Overview</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, here is your summary.</p>
                </div>
                {role === "Admin" && (
                  <button onClick={() => setIsAdding(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95">
                    ＋ Add Transaction
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <SummaryCard title="Total Balance" value={balance} />
                <SummaryCard title="Income" value={income} />
                <SummaryCard title="Expenses" value={expense} />
              </div>
              <Charts />
            </div>
          )}

          {/* VIEW 2: TRANSACTIONS */}
          {currentView === "transactions" && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold dark:text-white">Transactions</h2>
              <div className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-xl">
                <Filters />
                <TransactionTable />
              </div>
            </div>
          )}

          {/* VIEW 3: REPORTS */}
          {currentView === "reports" && <ReportsView />}

          {/* VIEW 4: INSIGHTS */}
          {currentView === "insights" && (
            <div className="animate-in zoom-in-95 duration-500">
              <h2 className="text-3xl font-bold dark:text-white mb-8">Smart Insights</h2>
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
