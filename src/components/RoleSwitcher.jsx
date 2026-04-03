import { useApp } from "../context/AppContext";

export default function RoleSwitcher() {
  const { role, setRole } = useApp();

  const roles = ["Viewer", "Admin"];

  return (
    <div className="flex items-center p-1 bg-gray-100 dark:bg-white/5 backdrop-blur-md rounded-xl border border-gray-200 dark:border-white/10 w-fit shadow-sm">
      {roles.map((r) => {
        const isActive = role === r;
        return (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`
              relative px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-lg
              ${isActive 
                ? "text-blue-600 dark:text-white shadow-sm" 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }
            `}
          >
            {/* The "Sliding" Background Pill */}
            {isActive && (
              <div className="absolute inset-0 bg-white dark:bg-blue-600/80 rounded-lg shadow-sm border border-gray-200 dark:border-blue-400/20 z-0" />
            )}
            
            <span className="relative z-10">{r}</span>
          </button>
        );
      })}
    </div>
  );
}

