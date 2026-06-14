'use client';

import { useState } from 'react';
import { addTransaction } from '../lib/localStorage';
import { useRouter } from 'next/navigation';

export default function AddTransaction() {
  const router = useRouter();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Current date

  const categories = [
    'Food', 'Transport', 'Utilities', 'Rent', 'Entertainment', 'Shopping',
    'Health', 'Education', 'Salary', 'Freelance', 'Investments', 'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    const newTransaction = {
      type,
      amount: parseFloat(amount),
      category: category || 'Uncategorized',
      description: description || (type === 'income' ? 'Income' : 'Expense'),
      date,
    };

    addTransaction(newTransaction);
    alert('Transaction added successfully!');
    router.push('/dashboard'); // Redirect to dashboard after adding
  };

  return (
    <div className="add-transaction-container">
      <h1>Add New Transaction</h1>
      <form onSubmit={handleSubmit} className="glass-card">
        <div className="form-group">
          <label htmlFor="type">Transaction Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 50.00"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Coffee at local cafe"
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="button primary-button">
            Add Transaction
          </button>
          <button type="button" className="button secondary-button" onClick={() => router.push('/dashboard')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
