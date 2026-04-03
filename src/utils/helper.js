export const calculateSummary = (transactions) => {
  let income = 0, expense = 0;
  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });
  return { income, expense, balance: income - expense };
};

export const getCategoryData = (transactions) => {
  const map = {};
  transactions.forEach(t => {
    if (t.type === "expense") {
      map[t.category] = (map[t.category] || 0) + t.amount;
    }
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
};