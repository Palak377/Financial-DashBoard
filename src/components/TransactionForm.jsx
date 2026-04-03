import { useState } from "react";

export default function TransactionForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    type: "expense",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount) return;
    onSave({ ...formData, amount: parseFloat(formData.amount) });
  };

  const inputStyles = "w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-3 rounded-xl outline-none focus:border-emerald-500 transition-all text-sm dark:text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-white/10 relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Transaction</h2>
        <p className="text-gray-500 text-sm mb-8">Enter the details of your transaction below.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Toggle (Expense/Income) */}
          <div className="flex gap-3">
            {['expense', 'income'].map((t) => (
              <label key={t} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                formData.type === t 
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                : "border-gray-100 dark:border-white/5 text-gray-400"
              }`}>
                <input 
                  type="radio" 
                  className="hidden" 
                  name="type" 
                  value={t} 
                  checked={formData.type === t}
                  onChange={(e) => setFormData({...formData, type: e.target.value})} 
                />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.type === t ? "border-emerald-500" : "border-gray-300"}`}>
                  {formData.type === t && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
                </div>
                <span className="capitalize font-bold text-sm">{t}</span>
              </label>
            ))}
          </div>

          {/* Amount */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
            <input
              type="number"
              placeholder="0.00"
              required
              className={`${inputStyles} pl-8 font-bold text-lg`}
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </div>

          {/* Description */}
          <input
            type="text"
            placeholder="What was this for?"
            className={inputStyles}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />

          {/* Category Select */}
          <select 
            className={inputStyles}
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="Food">Food & Drinks</option>
            <option value="Rent">Rent & Bills</option>
            <option value="Salary">Salary</option>
            <option value="Shopping">Shopping</option>
          </select>

          {/* Date */}
          <input
            type="date"
            className={inputStyles}
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
