import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getTemplates, updateTemplate } from '../../../lib/templates';

export const Route = createFileRoute('/app/templates/$id/edit')({
  component: EditTemplateComponent,
});

function EditTemplateComponent() {
  const { id } = useParams({ from: '/app/templates/$id/edit' });
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplate = async () => {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) return;
      const templates = await getTemplates({ data: { sessionId } });
      const template = templates.find((t: any) => t.id === id);
      if (template) {
        setName(template.name);
        setSubject(template.subject);
        setBody(template.body);
      } else {
        setError('Template not found');
      }
      setLoading(false);
    };
    fetchTemplate();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    
    try {
      const result = await updateTemplate({ data: { sessionId, id: id as string, name, subject, body } });
      if (result.success) {
        navigate({ to: '/app/templates' });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update template');
    }
  };

  if (loading) return <div className="text-center py-10">Loading template...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Email Template</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Template Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject Line</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Body</label>
            <textarea
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate({ to: '/app/templates' })}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
            >
              Update Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
