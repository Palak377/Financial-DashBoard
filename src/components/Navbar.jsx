import RoleSwitcher from "./RoleSwitcher";

export default function Navbar({ currentView, setCurrentView, dark, setDark }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "transactions", label: "Transactions", icon: "💸" },
    { id: "reports", label: "Reports", icon: "📈" },
    { id: "insights", label: "Insights", icon: "💡" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView("dashboard")}>
          <div className="bg-emerald-500 p-1.5 rounded-lg text-white">💰</div>
          <span className="text-xl font-black dark:text-white">Financial DashBoard</span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                currentView === item.id
                  ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <RoleSwitcher />
          <button 
            onClick={() => setDark(!dark)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 transition-all active:scale-90"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}