import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getTemplates, deleteTemplate } from '../../lib/templates';

export const Route = createFileRoute('/app/templates')({
  component: TemplatesComponent,
});

function TemplatesComponent() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    const data = await getTemplates({ data: { sessionId } });
    setTemplates(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    await deleteTemplate({ data: { sessionId, id } });
    fetchTemplates();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email Templates</h2>
        <Link 
          to="/app/templates/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          New Template
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-6 flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{template.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">Subject: {template.subject}</p>
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded text-sm text-gray-600 dark:text-gray-300 line-clamp-3 italic">
                  {template.body}
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <Link
                  to={`/app/templates/${template.id}/edit`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="text-sm font-medium text-red-600 hover:text-red-900 dark:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {templates.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No templates yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create your first welcome email template to get started.</p>
              <div className="mt-6">
                <Link 
                  to="/app/templates/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Template
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
