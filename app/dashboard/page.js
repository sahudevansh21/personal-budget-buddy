'use client';

import { useState, useEffect, useMemo } from 'react';
import { getTransactions } from '../lib/localStorage';
import Link from 'next/link';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const { totalIncome, totalExpenses, balance, categoriesSummary, recentTransactions } = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const currentBalance = income - expenses;

    const summary = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const category = t.category || 'Uncategorized';
      summary[category] = (summary[category] || 0) + parseFloat(t.amount);
    });

    const sortedCategories = Object.entries(summary)
      .sort(([, a], [, b]) => b - a)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / expenses) * 100 || 0,
      }));

    const sortedRecent = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: currentBalance,
      categoriesSummary: sortedCategories,
      recentTransactions: sortedRecent,
    };
  }, [transactions]);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="dashboard-summary-grid">
        <div className="glass-card summary-card">
          <h3>Total Income</h3>
          <span className="summary-value income-amount">${totalIncome.toFixed(2)}</span>
        </div>
        <div className="glass-card summary-card">
          <h3>Total Expenses</h3>
          <span className="summary-value expense-amount">${totalExpenses.toFixed(2)}</span>
        </div>
        <div className="glass-card summary-card">
          <h3>Current Balance</h3>
          <span className={`summary-value ${balance >= 0 ? 'balance-positive' : 'balance-negative'}`}>
            ${balance.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="dashboard-section glass-card">
        <h2>Spending by Category</h2>
        <div className="spending-visualization">
          {categoriesSummary.length > 0 ? (
            categoriesSummary.map((item, index) => (
              <div key={index} className="category-chart-item">
                <div className="category-name">
                  {item.category}: ${item.amount.toFixed(2)} ({item.percentage.toFixed(1)}%)
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${item.percentage > 100 ? 100 : item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p>No expenses recorded yet. <Link href="/add-transaction" className="navbar-link">Add one!</Link></p>
          )}
        </div>
      </div>

      <div className="dashboard-section glass-card">
        <h2>Recent Transactions</h2>
        <div className="transaction-list">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((t) => (
              <div key={t.id} className="transaction-item">
                <div className="transaction-info">
                  <h3>{t.description}</h3>
                  <p className="transaction-category">{t.category} - {new Date(t.date).toLocaleDateString()}</p>
                </div>
                <div className={`transaction-amount ${t.type === 'income' ? 'income-amount' : 'expense-amount'}`}>
                  {t.type === 'income' ? '+' : '-'} ${parseFloat(t.amount).toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <p>No recent transactions. <Link href="/add-transaction" className="navbar-link">Add your first transaction</Link>!</p>
          )}
        </div>
      </div>
    </div>
  );
}
