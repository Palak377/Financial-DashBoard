

export default function SummaryCard({ title, value }) {
  const isIncome = title.toLowerCase().includes("income");
  const isExpense = title.toLowerCase().includes("expense");

  // Logic to switch colors based on both Category AND Theme
  const getTheme = () => {
    if (isIncome) return {
      light: "bg-emerald-50 border-emerald-200 text-emerald-700 icon-bg-emerald-100",
      dark: "dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 dark:icon-bg-emerald-500/20"
    };
    if (isExpense) return {
      light: "bg-rose-50 border-rose-200 text-rose-700 icon-bg-rose-100",
      dark: "dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 dark:icon-bg-rose-500/20"
    };
    return {
      light: "bg-blue-50 border-blue-200 text-blue-700 icon-bg-blue-100",
      dark: "dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400 dark:icon-bg-blue-500/20"
    };
  };

  const theme = getTheme();

  return (
    <div className={`relative group p-6 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md border
      ${theme.light} ${theme.dark} bg-white dark:backdrop-blur-md`}>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-[11px] uppercase tracking-[0.2em] font-bold">
            {title}
          </p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-lg font-bold">₹</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">
              {value.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

        {/* Dynamic Icon Container */}
        <div className={`flex items-center justify-center h-12 w-12 rounded-xl border transition-all
          ${isIncome ? 'border-emerald-200 bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/20' : 
            isExpense ? 'border-rose-200 bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/20' : 
            'border-blue-200 bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/20'}`}>
          
          {isIncome ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ) : isExpense ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          )}
        </div>
      </div>

      {/* Modern Progress Detail Line */}
      <div className="mt-4 h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full w-2/3 rounded-full opacity-60 bg-current`} />
      </div>
    </div>
  );
}
