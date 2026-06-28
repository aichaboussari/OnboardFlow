import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getClients } from '../../../lib/clients';
import { getChecklists } from '../../../lib/checklists';
import { getTemplates } from '../../../lib/templates';
import { createFlow } from '../../../lib/flows';

export const Route = createFileRoute('/app/flows/new')({
  component: NewFlowComponent,
});

function NewFlowComponent() {
  const [clients, setClients] = useState<any[]>([]);
  const [checklists, setChecklists] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedChecklist, setSelectedChecklist] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) return;
      
      const [c, ch, t] = await Promise.all([
        getClients({ data: { sessionId } }),
        getChecklists({ data: { sessionId } }),
        getTemplates({ data: { sessionId } })
      ]);
      
      setClients(c);
      setChecklists(ch);
      setTemplates(t);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;

    if (!selectedClient || !selectedChecklist) {
      setError('Please select a client and a checklist');
      return;
    }

    try {
      const result = await createFlow({ 
        data: { 
          sessionId, 
          client_id: selectedClient, 
          checklist_id: selectedChecklist,
          template_id: selectedTemplate || undefined
        } 
      });
      
      if (result.success) {
        navigate({ to: `/app/flows/${result.id}` });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start flow');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Start New Onboarding Flow</h2>
      
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Client</label>
            <select
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option value="">-- Choose a client --</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Checklist</label>
            <select
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedChecklist}
              onChange={(e) => setSelectedChecklist(e.target.value)}
            >
              <option value="">-- Choose a checklist --</option>
              {checklists.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.tasks.length} tasks)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Welcome Email (Optional)</label>
            <select
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">-- No email --</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic">
              The welcome email will be logged as "sent" immediately.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate({ to: '/app/flows' })}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
            >
              Create Flow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
