import React from 'react';
import { useApp } from "../context/AppContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Insights() {
  const { transactions } = useApp();

  // --- Data Logic ---
  const expenseMap = {};
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((t) => {
    if (t.type === "income") totalIncome += t.amount;
    if (t.type === "expense") {
      totalExpense += t.amount;
      expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
    }
  });

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;
  
  // Find Top Category
  const categories = Object.entries(expenseMap).sort((a, b) => b[1] - a[1]);
  const topCategory = categories[0]?.[0] || "None";
  const topAmount = categories[0]?.[1] || 0;

  // Mock data for the chart (Matches your screenshot "Feb vs Mar")
  const chartData = [
    { name: 'Income', February: 105000, March: 125200 },
    { name: 'Expense', February: 18000, March: 34187 },
  ];

  return (
    <div className="p-6 space-y-8 bg-[#0B0F17] min-h-screen text-white">
      <div>
        <h1 className="text-2xl font-bold">Insights</h1>
        <p className="text-gray-400 text-sm">Key observations from your financial data</p>
      </div>

      {/* --- Top Metric Cards Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InsightCard 
          title="Top Spending Category" 
          value={topCategory} 
          subValue={`₹${topAmount.toLocaleString()} spent — your biggest expense bucket.`}
          icon="🛍️"
        />
        <InsightCard 
          title="Savings Rate" 
          value={`${savingsRate}%`} 
          subValue="Great job! You're saving above the recommended 20% threshold."
          icon="🐷"
        />
        <InsightCard 
          title="Month-on-Month Expenses" 
          value="+99%" 
          valueColor="text-red-400"
          subValue="Spending rose vs February 2026. Review discretionary categories."
          icon="📈"
        />
        <InsightCard 
          title="Net Savings This Month" 
          value={`₹${netSavings.toLocaleString()}`} 
          subValue={`Income ₹${totalIncome.toLocaleString()} minus expenses ₹${totalExpense.toLocaleString()}`}
          icon="🎯"
        />
        <InsightCard 
          title="Most Active Month" 
          value="Mar 2026" 
          subValue="The month with the highest combined income and expense activity."
          icon="📊"
        />
        <InsightCard 
          title="Avg Monthly Income" 
          value="₹1,08,400" 
          subValue="Average income across all recorded months in your history."
          icon="📉"
        />
      </div>

      {/* --- Monthly Comparison Chart --- */}
      <div className="bg-[#151921] p-6 rounded-2xl border border-white/5">
        <h3 className="text-lg font-semibold mb-1">Monthly Comparison</h3>
        <p className="text-gray-500 text-xs mb-6">February 2026 vs March 2026</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
              <XAxis dataKey="name" stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#718096" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}K`} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1A202C', border: 'none', borderRadius: '8px'}} />
              <Legend verticalAlign="bottom" iconType="circle" />
              <Bar dataKey="February" fill="#4C51BF" radius={[4, 4, 0, 0]} barSize={60} />
              <Bar dataKey="March" fill="#805AD5" radius={[4, 4, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Full Category Breakdown --- */}
      <div className="bg-[#151921] p-6 rounded-2xl border border-white/5">
        <h3 className="text-lg font-semibold mb-6">Full Category Breakdown</h3>
        <div className="space-y-5">
          {categories.map(([cat, amt], index) => {
            const pct = Math.round((amt / topAmount) * 100);
            return (
              <div key={cat} className="flex items-center gap-4">
                <span className="text-gray-500 text-xs w-4">{index + 1}</span>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCategoryColor(index) }} />
                <span className="text-sm w-32 truncate">{cat}</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${pct}%`, backgroundColor: getCategoryColor(index) }} 
                  />
                </div>
                <div className="text-right w-24">
                  <p className="text-sm font-bold">₹{amt.toLocaleString()}</p>
                </div>
                <span className="text-gray-500 text-xs w-10">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- Helper Components & Functions ---

function InsightCard({ title, value, subValue, icon, valueColor = "text-white" }) {
  return (
    <div className="bg-[#151921] p-5 rounded-2xl border border-white/5 flex gap-4 transition-hover hover:bg-[#1C222D]">
      <div className="text-2xl mt-1">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{title}</p>
        <h4 className={`text-xl font-black mt-0.5 ${valueColor}`}>{value}</h4>
        <p className="text-[11px] text-gray-400 mt-1 leading-tight">{subValue}</p>
      </div>
    </div>
  );
}

function getCategoryColor(index) {
  const colors = ['#E91E63', '#FF9800', '#3F51B5', '#009688', '#9C27B0', '#FFC107', '#2196F3', '#4CAF50', '#8BC34A'];
  return colors[index % colors.length];
}
// import { useApp } from "../context/AppContext";

// export default function Insights() {
//   const { transactions } = useApp();

//   const expenseMap = {};
//   transactions.forEach((t) => {
//     if (t.type === "expense") {
//       expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
//     }
//   });

//   let maxCategory = "None";
//   let maxAmount = 0;

//   for (let cat in expenseMap) {
//     if (expenseMap[cat] > maxAmount) {
//       maxAmount = expenseMap[cat];
//       maxCategory = cat;
//     }
//   }

//   // Percentage calculation (Optional but looks great)
//   const totalExpense = Object.values(expenseMap).reduce((a, b) => a + b, 0);
//   const percentage = totalExpense > 0 ? Math.round((maxAmount / totalExpense) * 100) : 0;

//   return (
//     <div className="relative overflow-hidden p-6 rounded-2xl transition-all duration-300 border
//       bg-white border-gray-200 shadow-sm
//       dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-xl">
      
//       {/* Decorative Background Icon for "Intelligence" feel */}
//       <div className="absolute -right-4 -top-4 opacity-5 dark:opacity-10 pointer-events-none">
//         <svg className="w-32 h-32 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
//           <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//         </svg>
//       </div>

//       <div className="relative z-10">
//         <div className="flex items-center gap-2 mb-4">
//           <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
//             <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
//             </svg>
//           </div>
//           <h2 className="text-xl font-bold text-gray-900 dark:text-white">Smart Insights</h2>
//         </div>

//         <div className="space-y-4">
//           {/* Main Insight Row */}
//           <div className="flex justify-between items-end">
//             <div>
//               <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                 Highest Spending
//               </p>
//               <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
//                 {maxCategory}
//               </h3>
//             </div>
//             <div className="text-right">
//               <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Total</p>
//               <p className="text-xl font-bold text-gray-900 dark:text-white">₹{maxAmount.toLocaleString("en-IN")}</p>
//             </div>
//           </div>

//           {/* Progress Visual */}
//           <div className="space-y-1.5">
//             <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
//               <span>Category Weight</span>
//               <span>{percentage}% of total expenses</span>
//             </div>
//             <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
//               <div 
//                 className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
//                 style={{ width: `${percentage}%` }}
//               />
//             </div>
//           </div>

//           {/* Advice Section */}
//           <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
//             <p className="text-sm italic text-gray-600 dark:text-gray-300 leading-relaxed">
//               "You've spent a significant portion on <span className="font-bold text-indigo-500">{maxCategory}</span>. 
//               Setting a strict budget for this could save you roughly <span className="font-bold">₹{Math.round(maxAmount * 0.2)}</span> next month."
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
