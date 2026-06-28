import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getFlowDetail, updateTaskStatus } from '../../../lib/flows';
import { addDocument, signDocument, deleteDocument } from '../../../lib/documents';

export const Route = createFileRoute('/app/flows/$id')({
  component: FlowDetailComponent,
});

function FlowDetailComponent() {
  const { id } = useParams({ from: '/app/flows/$id' });
  const [flow, setFlow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [docName, setDocName] = useState('');
  const [docPath, setDocPath] = useState('');
  const [error, setError] = useState('');

  const fetchDetail = async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    try {
      const data = await getFlowDetail({ data: { sessionId, id: id as string } });
      setFlow(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleTaskToggle = async (taskId: string, currentStatus: number) => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    
    await updateTaskStatus({ 
      data: { 
        sessionId, 
        flowId: id as string, 
        taskId, 
        completed: !currentStatus 
      } 
    });
    fetchDetail();
  };

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    
    await addDocument({ 
      data: { 
        sessionId, 
        flow_id: id as string, 
        name: docName, 
        file_path: docPath 
      } 
    });
    setDocName('');
    setDocPath('');
    fetchDetail();
  };

  const handleSignDoc = async (docId: string) => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    await signDocument({ data: { sessionId, documentId: docId } });
    fetchDetail();
  };

  const handleDeleteDoc = async (docId: string) => {
    if (!confirm('Delete this document?')) return;
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    await deleteDocument({ data: { sessionId, documentId: docId } });
    fetchDetail();
  };

  if (loading) return <div className="text-center py-10">Loading flow...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/app/flows" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-2 inline-block">
            &larr; Back to Flows
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{flow.client_name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{flow.client_email}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Overall Progress</div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{Math.round(flow.progress_pct)}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Onboarding Tasks</h3>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {flow.tasks.map((task: any) => (
                <li key={task.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!!task.completed}
                      onChange={() => handleTaskToggle(task.id, task.completed)}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className={`ml-3 text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                      {task.task_name}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar: Documents */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Documents</h3>
            </div>
            <div className="p-6 space-y-4">
              {flow.documents.map((doc: any) => (
                <div key={doc.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{doc.file_path}</p>
                    {doc.signed ? (
                      <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Signed
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleSignDoc(doc.id)}
                        className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Mark as Signed
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              {flow.documents.length === 0 && (
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 italic">No documents uploaded.</p>
              )}

              <form onSubmit={handleAddDoc} className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Add Document</p>
                <input
                  type="text"
                  required
                  placeholder="Doc Name (e.g. Contract)"
                  className="block w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                />
                <input
                  type="text"
                  required
                  placeholder="File Path or URL"
                  className="block w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={docPath}
                  onChange={(e) => setDocPath(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded text-sm font-medium transition-colors"
                >
                  Add Doc
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
