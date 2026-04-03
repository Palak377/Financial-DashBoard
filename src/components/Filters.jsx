import { useApp } from "../context/AppContext";

export default function Filters() {
  const { filter, setFilter, search, setSearch } = useApp();

  // Vibrant Light Mode + Sleek Dark Mode
  const inputStyles = `
    w-full px-4 py-2.5 text-sm transition-all outline-none rounded-xl border-2
    /* Light Mode: Indigo Tint */
    bg-indigo-50/50 border-indigo-100 text-indigo-900 placeholder:text-indigo-300
    focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10
    /* Dark Mode: Glassmorphism */
    dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:text-white dark:placeholder:text-gray-500
    dark:focus:border-blue-500/50 dark:focus:ring-blue-500/10
  `;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full mb-8">
      
      {/* Search Input Container */}
      <div className="relative w-full sm:max-w-xs group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg 
            className="w-5 h-5 text-indigo-400 dark:text-gray-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-blue-400 transition-colors" 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputStyles} pl-11`}
        />
      </div>

      {/* Filter Dropdown Container */}
      <div className="relative w-full sm:w-48 group">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          className={`${inputStyles} appearance-none cursor-pointer pr-10 font-medium`}
        >
          <option value="all" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">📑 All Transactions</option>
          <option value="income" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">💰 Income Only</option>
          <option value="expense" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">💸 Expenses Only</option>
        </select>
        
        {/* Custom Chevron Icon */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg 
            className="w-4 h-4 text-indigo-400 dark:text-gray-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-blue-400 transition-colors" 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

    </div>
  );
}

