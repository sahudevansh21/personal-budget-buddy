'use client';

const STORAGE_KEY_TRANSACTIONS = 'budget_buddy_transactions';
const STORAGE_KEY_BUDGETS = 'budget_buddy_budgets';

const getParsedItem = (key) => {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error(`Error parsing localStorage item for key ${key}:`, error);
    return [];
  }
};

const setStringifiedItem = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error stringifying localStorage item for key ${key}:`, error);
  }
};

// Transactions
export const getTransactions = () => getParsedItem(STORAGE_KEY_TRANSACTIONS);

export const addTransaction = (transaction) => {
  const transactions = getTransactions();
  const newTransaction = { id: Date.now().toString(), ...transaction }; // Simple ID generation
  transactions.push(newTransaction);
  setStringifiedItem(STORAGE_KEY_TRANSACTIONS, transactions);
  return newTransaction;
};

export const deleteTransaction = (id) => {
  let transactions = getTransactions();
  transactions = transactions.filter(t => t.id !== id);
  setStringifiedItem(STORAGE_KEY_TRANSACTIONS, transactions);
};

// Budgets
export const getBudgets = () => getParsedItem(STORAGE_KEY_BUDGETS);

export const setBudgets = (budgets) => setStringifiedItem(STORAGE_KEY_BUDGETS, budgets);

export const addBudget = (budget) => {
  const budgets = getBudgets();
  const newBudget = { id: Date.now().toString(), ...budget };
  budgets.push(newBudget);
  setStringifiedItem(STORAGE_KEY_BUDGETS, budgets);
  return newBudget;
};

export const updateBudget = (updatedBudget) => {
  let budgets = getBudgets();
  budgets = budgets.map(b => b.id === updatedBudget.id ? updatedBudget : b);
  setStringifiedItem(STORAGE_KEY_BUDGETS, budgets);
};

export const deleteBudget = (id) => {
  let budgets = getBudgets();
  budgets = budgets.filter(b => b.id !== id);
  setStringifiedItem(STORAGE_KEY_BUDGETS, budgets);
};
