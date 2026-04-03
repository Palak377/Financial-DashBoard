import { useApp } from "../context/AppContext";

export default function Insights() {
  const { transactions } = useApp();

  const expenseMap = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
    }
  });

  let maxCategory = "None";
  let maxAmount = 0;

  for (let cat in expenseMap) {
    if (expenseMap[cat] > maxAmount) {
      maxAmount = expenseMap[cat];
      maxCategory = cat;
    }
  }

  // Percentage calculation (Optional but looks great)
  const totalExpense = Object.values(expenseMap).reduce((a, b) => a + b, 0);
  const percentage = totalExpense > 0 ? Math.round((maxAmount / totalExpense) * 100) : 0;

  return (
    <div className="relative overflow-hidden p-6 rounded-2xl transition-all duration-300 border
      bg-white border-gray-200 shadow-sm
      dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-xl">
      
      {/* Decorative Background Icon for "Intelligence" feel */}
      <div className="absolute -right-4 -top-4 opacity-5 dark:opacity-10 pointer-events-none">
        <svg className="w-32 h-32 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Smart Insights</h2>
        </div>

        <div className="space-y-4">
          {/* Main Insight Row */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Highest Spending
              </p>
              <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {maxCategory}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">₹{maxAmount.toLocaleString("en-IN")}</p>
            </div>
          </div>

          {/* Progress Visual */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
              <span>Category Weight</span>
              <span>{percentage}% of total expenses</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Advice Section */}
          <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <p className="text-sm italic text-gray-600 dark:text-gray-300 leading-relaxed">
              "You've spent a significant portion on <span className="font-bold text-indigo-500">{maxCategory}</span>. 
              Setting a strict budget for this could save you roughly <span className="font-bold">₹{Math.round(maxAmount * 0.2)}</span> next month."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
