import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Personal Budget Buddy',
  description: 'Your personal finance tracker without sharing sensitive data.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
