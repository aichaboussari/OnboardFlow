import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getChecklists, deleteChecklist } from '../../lib/checklists';

export const Route = createFileRoute('/app/checklists')({
  component: ChecklistsComponent,
});

function ChecklistsComponent() {
  const [checklists, setChecklists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChecklists = async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    const data = await getChecklists({ data: { sessionId } });
    setChecklists(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this checklist?')) return;
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    await deleteChecklist({ data: { sessionId, id } });
    fetchChecklists();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Task Checklists</h2>
        <Link 
          to="/app/checklists/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          New Checklist
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {checklists.map((checklist) => (
            <div key={checklist.id} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-6 flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{checklist.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{checklist.tasks.length} tasks</p>
                <ul className="mt-4 space-y-2">
                  {checklist.tasks.slice(0, 3).map((task: any) => (
                    <li key={task.id} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg className="h-4 w-4 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {task.task_name}
                    </li>
                  ))}
                  {checklist.tasks.length > 3 && (
                    <li className="text-xs text-gray-400 pl-6">+ {checklist.tasks.length - 3} more...</li>
                  )}
                </ul>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <Link
                  to={`/app/checklists/${checklist.id}/edit`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(checklist.id)}
                  className="text-sm font-medium text-red-600 hover:text-red-900 dark:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {checklists.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No checklists yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a reusable task checklist to standardize your onboarding.</p>
              <div className="mt-6">
                <Link 
                  to="/app/checklists/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Checklist
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
