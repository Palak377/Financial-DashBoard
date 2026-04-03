import { useState } from "react";
import Charts from "../components/Charts";

export default function ReportsView() {
  const [reportType, setReportType] = useState("category");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold dark:text-white text-gray-900">Financial Reports</h2>
        <p className="text-gray-500 dark:text-gray-400">Detailed analysis of your spending habits.</p>
      </div>

      <div className="flex gap-4 p-1 bg-gray-100 dark:bg-white/5 w-fit rounded-2xl border border-gray-200 dark:border-white/10">
        <button
          onClick={() => setReportType("category")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            reportType === "category" ? "bg-white dark:bg-gray-800 text-emerald-500 shadow-md" : "text-gray-400"
          }`}
        >
          Spending BreakDown
        </button>
        <button
          onClick={() => setReportType("trend")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            reportType === "trend" ? "bg-white dark:bg-gray-800 text-emerald-500 shadow-md" : "text-gray-400"
          }`}
        >
          Balance Over Time
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800/40 p-8 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-2xl min-h-[400px] flex items-center justify-center">
        {reportType === "category" ? (
          <div className="w-full text-center">
             <h3 className="text-lg font-bold dark:text-white mb-4">Spending Breakdown</h3>
             <Charts /> {/* Replace with a Pie Chart component if you have one */}
          </div>
        ) : (
          <div className="w-full text-center">
            <h3 className="text-lg font-bold dark:text-white mb-4">Balance over Time</h3>
            <div className="h-64 flex items-end justify-around gap-2 px-10">
               {/* Simple CSS Bar Trend Simulation */}
               {[40, 70, 45, 90, 65, 80].map((h, i) => (
                 <div key={i} style={{ height: `${h}%` }} className="w-full bg-emerald-500/20 border-t-4 border-emerald-500 rounded-t-lg animate-pulse" />
               ))}
            </div>
            <p className="mt-8 text-gray-400 text-sm italic">Trend analysis for April 2026</p>
          </div>
        )}
      </div>
    </div>
  );
}