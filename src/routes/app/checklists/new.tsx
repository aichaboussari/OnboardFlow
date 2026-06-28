import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { addChecklist } from '../../../lib/checklists';

export const Route = createFileRoute('/app/checklists/new')({
  component: AddChecklistComponent,
});

function AddChecklistComponent() {
  const [name, setName] = useState('');
  const [tasks, setTasks] = useState<string[]>(['']);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddTask = () => {
    setTasks([...tasks, '']);
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleTaskChange = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    
    const validTasks = tasks.filter(t => t.trim() !== '');
    if (validTasks.length === 0) {
      setError('Please add at least one task');
      return;
    }

    try {
      const result = await addChecklist({ data: { sessionId, name, tasks: validTasks } });
      if (result.success) {
        navigate({ to: '/app/checklists' });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add checklist');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Task Checklist</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Checklist Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Standard Onboarding"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tasks</label>
            {tasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  required
                  placeholder={`Task #${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                  value={task}
                  onChange={(e) => handleTaskChange(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTask(index)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  disabled={tasks.length === 1}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddTask}
              className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Task
            </button>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate({ to: '/app/checklists' })}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
            >
              Save Checklist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
