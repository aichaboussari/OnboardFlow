import { createFileRoute, redirect, Outlet, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { verifySession, logout } from '../lib/auth';

export const Route = createFileRoute('/app')({
  beforeLoad: async ({ location }) => {
    // On the server, we can't check localStorage.
    // So we'll have to do the check on the client.
    // However, beforeLoad runs on both.
    // For now, we'll let it pass and check in the component or use a clever way.
    // Actually, TanStack Start can use cookies for this, but the task said localStorage.
    // If we use localStorage, the server-side render won't know if we're logged in.
  },
  component: AppLayout,
});

function AppLayout() {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        navigate({ to: '/login' });
        return;
      }

      const result = await verifySession({ data: { sessionId } });
      if (result.success) {
        setBusiness(result.business);
        setLoading(false);
      } else {
        localStorage.removeItem('sessionId');
        navigate({ to: '/login' });
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      await logout({ data: { sessionId } });
      localStorage.removeItem('sessionId');
    }
    navigate({ to: '/login' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/app', icon: 'DashboardIcon' },
    { name: 'Clients', href: '/app/clients', icon: 'UsersIcon' },
    { name: 'Templates', href: '/app/templates', icon: 'TemplateIcon' },
    { name: 'Checklists', href: '/app/checklists', icon: 'ChecklistIcon' },
    { name: 'Flows', href: '/app/flows', icon: 'FlowIcon' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">OnboardFlow</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              activeProps={{ className: 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' }}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center px-4 py-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                OnboardFlow
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">OnboardFlow</span>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  activeProps={{ className: 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' }}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-8">
          <button
            className="md:hidden p-2 text-gray-600 dark:text-gray-400"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 flex justify-center md:justify-start">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              OnboardFlow
            </h1>
          </div>
          <div className="flex items-center">
            {/* Action buttons if needed */}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
