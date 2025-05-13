'use client';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('admin-auth');
    setIsAuthenticated(auth === 'true');

    // Listen for logout event
    const handleLogout = () => {
      setIsAuthenticated(false);
    };

    window.addEventListener('admin-logout', handleLogout);
    return () => window.removeEventListener('admin-logout', handleLogout);
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '121212') {
      sessionStorage.setItem('admin-auth', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Invalid PIN');
      setPin('');
    }
  };

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <form
          onSubmit={handlePinSubmit}
          className="bg-card border border-border rounded-xl p-8 w-full max-w-sm shadow-xl animate-fade-in"
        >
          <h2 className="text-2xl font-bold mb-6 text-center font-heading">Enter PIN</h2>
      
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter your PIN"
            className="w-full px-4 py-3 mb-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
      
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
      
    );
  }

  return <>{children}</>;
}
