import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../lib/dashboard';

export const Route = createFileRoute('/app/')({
  component: DashboardComponent,
});

function DashboardComponent() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) return;
      const data = await getDashboardStats({ data: { sessionId } });
      setStats(data);
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <Link 
          to="/app/flows/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          New Onboarding
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Flows</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.activeFlows}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.completionRate}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Clients This Month</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.clientsThisMonth}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="p-0">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.recentActivity.map((activity: any, index: number) => (
              <li key={index} className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${activity.type === 'flow_created' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {activity.type === 'flow_created' ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.type === 'flow_created' ? (
                        <>Started onboarding for <span className="font-bold">{activity.client_name}</span></>
                      ) : (
                        <>Signed <span className="font-bold">{activity.doc_name}</span> for <span className="font-bold">{activity.client_name}</span></>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
            {stats.recentActivity.length === 0 && (
              <li className="p-6 text-center text-gray-500 dark:text-gray-400">
                No recent activity to show. Start by adding a client!
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
