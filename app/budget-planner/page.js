'use client';

import { useState, useEffect, useMemo } from 'react';
import { getBudgets, setBudgets, addBudget, updateBudget, deleteBudget } from '../lib/localStorage';
import { getTransactions } from '../lib/localStorage';

export default function BudgetPlanner() {
  const [budgets, setLocalBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newBudgetCategory, setNewBudgetCategory] = useState('');
  const [newBudgetLimit, setNewBudgetLimit] = useState('');
  const [editingBudget, setEditingBudget] = useState(null); // Stores budget being edited

  const categories = [
    'Food', 'Transport', 'Utilities', 'Rent', 'Entertainment', 'Shopping',
    'Health', 'Education', 'Other'
  ];

  useEffect(() => {
    setLocalBudgets(getBudgets());
    setTransactions(getTransactions());
  }, []);

  // Calculate current spending for each budget category
  const budgetsWithSpending = useMemo(() => {
    const categorySpending = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const cat = t.category || 'Other';
      categorySpending[cat] = (categorySpending[cat] || 0) + parseFloat(t.amount);
    });

    return budgets.map(budget => ({
      ...budget,
      currentSpent: categorySpending[budget.category] || 0,
    }));
  }, [budgets, transactions]);

  const handleAddOrUpdateBudget = (e) => {
    e.preventDefault();
    if (!newBudgetCategory || !newBudgetLimit || isNaN(parseFloat(newBudgetLimit)) || parseFloat(newBudgetLimit) <= 0) {
      alert('Please enter a valid category and a positive budget limit.');
      return;
    }

    const budgetData = {
      category: newBudgetCategory,
      limit: parseFloat(newBudgetLimit),
    };

    let updatedBudgets;
    if (editingBudget) {
      // Update existing budget
      updatedBudgets = budgets.map(b => b.id === editingBudget.id ? { ...b, ...budgetData } : b);
      updateBudget({ id: editingBudget.id, ...budgetData });
    } else {
      // Add new budget
      const existingBudget = budgets.find(b => b.category === newBudgetCategory);
      if (existingBudget) {
        alert(`Budget for ${newBudgetCategory} already exists. Please edit it instead.`);
        return;
      }
      const newBudget = addBudget(budgetData);
      updatedBudgets = [...budgets, newBudget];
    }

    setLocalBudgets(updatedBudgets);
    setNewBudgetCategory('');
    setNewBudgetLimit('');
    setEditingBudget(null);
    alert(editingBudget ? 'Budget updated successfully!' : 'Budget added successfully!');
  };

  const handleDeleteBudget = (id) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
      setLocalBudgets(getBudgets()); // Refresh from localStorage
      alert('Budget deleted successfully!');
    }
  };

  const handleEditClick = (budget) => {
    setEditingBudget(budget);
    setNewBudgetCategory(budget.category);
    setNewBudgetLimit(budget.limit);
  };

  const handleCancelEdit = () => {
    setEditingBudget(null);
    setNewBudgetCategory('');
    setNewBudgetLimit('');
  };

  return (
    <div className="budget-planner-container">
      <h1>Budget Planner</h1>

      <div className="glass-card">
        <h2>{editingBudget ? 'Edit Budget' : 'Set New Budget'}</h2>
        <form onSubmit={handleAddOrUpdateBudget}>
          <div className="form-group">
            <label htmlFor="budgetCategory">Category</label>
            <select
              id="budgetCategory"
              value={newBudgetCategory}
              onChange={(e) => setNewBudgetCategory(e.target.value)}
              disabled={!!editingBudget} // Disable category selection when editing
              required
            >
              <option value="">Select a Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budgetLimit">Budget Limit ($)</label>
            <input
              type="number"
              id="budgetLimit"
              value={newBudgetLimit}
              onChange={(e) => setNewBudgetLimit(e.target.value)}
              placeholder="e.g., 500.00"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="button primary-button">
              {editingBudget ? 'Update Budget' : 'Add Budget'}
            </button>
            {editingBudget && (
              <button type="button" className="button secondary-button" onClick={handleCancelEdit}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-card">
        <h2>Your Budgets</h2>
        <div className="transaction-list">
          {budgetsWithSpending.length > 0 ? (
            budgetsWithSpending.map((budget) => {
              const percentageSpent = (budget.currentSpent / budget.limit) * 100;
              const progressBarColor = percentageSpent > 100 ? '#F44336' : (percentageSpent > 75 ? '#FF9800' : '#4CAF50');

              return (
                <div key={budget.id} className="budget-item">
                  <div className="budget-details">
                    <h3>{budget.category}</h3>
                    <p className="budget-progress-info">
                      Spent: ${budget.currentSpent.toFixed(2)} / Limit: ${budget.limit.toFixed(2)}
                    </p>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar"
                        style={{ width: `${percentageSpent > 100 ? 100 : percentageSpent}%`, backgroundColor: progressBarColor }}
                      ></div>
                    </div>
                    <p className="budget-progress-info" style={{ color: percentageSpent > 100 ? '#F44336' : 'inherit' }}>
                      {percentageSpent.toFixed(1)}% spent {percentageSpent > 100 && '(Over Budget!)'}
                    </p>
                  </div>
                  <div className="budget-actions">
                    <button className="button secondary-button" onClick={() => handleEditClick(budget)}>
                      Edit
                    </button>
                    <button className="danger-button" onClick={() => handleDeleteBudget(budget.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No budgets set yet. Use the form above to add your first budget!</p>
          )}
        </div>
      </div>
    </div>
  );
}
