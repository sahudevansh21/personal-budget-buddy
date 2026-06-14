'use client';

import { useState, useEffect, useMemo } from 'react';
import { getTransactions, deleteTransaction } from '../lib/localStorage';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  const categories = [
    'Food', 'Transport', 'Utilities', 'Rent', 'Entertainment', 'Shopping',
    'Health', 'Education', 'Salary', 'Freelance', 'Investments', 'Other'
  ];

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
      setTransactions(getTransactions()); // Refresh from localStorage
      alert('Transaction deleted successfully!');
    }
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => (t.category || 'Uncategorized') === filterCategory);
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [transactions, filterType, filterCategory, sortOrder]);

  return (
    <div className="transaction-history-container">
      <h1>Transaction History</h1>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2>Filters & Sorting</h2>
        <div className="grid-container">
          <div className="form-group">
            <label htmlFor="filterType">Type</label>
            <select id="filterType" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="filterCategory">Category</label>
            <select id="filterCategory" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="Uncategorized">Uncategorized</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sortOrder">Sort by Date</label>
            <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h2>All Transactions</h2>
        {filteredAndSortedTransactions.length > 0 ? (
          <div className="transaction-table-container">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td>{t.description}</td>
                    <td>{t.category || 'Uncategorized'}</td>
                    <td>{t.type}</td>
                    <td className={`amount ${t.type}`}>
                      {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)}
                    </td>
                    <td>
                      <button className="danger-button" onClick={() => handleDelete(t.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No transactions found matching your criteria. <Link href="/add-transaction" className="navbar-link">Add a new transaction</Link>!</p>
        )}
      </div>
    </div>
  );
}
