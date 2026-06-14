'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Add Transaction', href: '/add-transaction' },
    { name: 'Budget Planner', href: '/budget-planner' },
    { name: 'Transaction History', href: '/transaction-history' },
  ];

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        Budget Buddy
      </Link>
      <div className="navbar-links">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`navbar-link ${pathname === link.href ? 'active' : ''}`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
