import Link from 'next/link';

export default function Home() {
  return (
    <div className="landing-page-container">
      <h1 className="landing-title">Personal Budget Buddy</h1>
      <p className="landing-subtitle">Visualize your spending, simplify your saving.</p>
      <p className="landing-description">
        Take control of your finances without sharing sensitive data. Manually input your income and expenses,
        categorize them, and gain clear insights into your financial habits. All data securely stored in your browser.
      </p>
      <div className="landing-actions">
        <Link href="/dashboard" className="button primary-button">
          Get Started
        </Link>
        <Link href="/add-transaction" className="button secondary-button">
          Add First Transaction
        </Link>
      </div>
    </div>
  );
}
