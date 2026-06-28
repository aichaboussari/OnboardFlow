import { createServerFn } from '@tanstack/react-start';
import db from './db';

const generateId = () => crypto.randomUUID();

async function getBusinessId(sessionId: string) {
  const session = db.prepare('SELECT business_id FROM sessions WHERE id = ? AND expires_at > ?').get(sessionId, new Date().toISOString()) as { business_id: string } | undefined;
  return session?.business_id;
}

export const getFlows = createServerFn({ method: 'GET' })
  .validator((data: { sessionId: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    return db.prepare(`
      SELECT f.*, c.name as client_name, c.email as client_email 
      FROM onboarding_flows f
      JOIN clients c ON f.client_id = c.id
      WHERE f.business_id = ? 
      ORDER BY f.created_at DESC
    `).all(businessId);
  });

export const getFlowDetail = createServerFn({ method: 'GET' })
  .validator((data: { sessionId: string; id: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    const flow = db.prepare(`
      SELECT f.*, c.name as client_name, c.email as client_email 
      FROM onboarding_flows f
      JOIN clients c ON f.client_id = c.id
      WHERE f.id = ? AND f.business_id = ?
    `).get(data.id, businessId) as any;
    
    if (!flow) throw new Error('Flow not found');
    
    flow.tasks = db.prepare('SELECT * FROM flow_tasks WHERE flow_id = ? ORDER BY order_index ASC').all(data.id);
    flow.documents = db.prepare('SELECT * FROM documents WHERE flow_id = ? ORDER BY signed ASC').all(data.id);
    
    return flow;
  });

export const createFlow = createServerFn({ method: 'POST' })
  .validator((data: { 
    sessionId: string; 
    client_id: string; 
    checklist_id: string; 
    template_id?: string 
  }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    const flowId = generateId();
    
    // Get checklist tasks
    const checklistTasks = db.prepare('SELECT task_name, order_index FROM checklist_tasks WHERE checklist_id = ? ORDER BY order_index ASC').all(data.checklist_id) as any[];
    
    const runTransaction = db.transaction(() => {
      // Create flow
      db.prepare('INSERT INTO onboarding_flows (id, business_id, client_id, status, progress_pct) VALUES (?, ?, ?, ?, ?)').run(
        flowId,
        businessId,
        data.client_id,
        'active',
        0
      );
      
      // Copy tasks
      const insertTask = db.prepare('INSERT INTO flow_tasks (id, flow_id, task_name, completed, order_index) VALUES (?, ?, ?, ?, ?)');
      checklistTasks.forEach((task, index) => {
        insertTask.run(generateId(), flowId, task.task_name, 0, task.order_index);
      });
      
      // Handle template (email log)
      if (data.template_id) {
        const template = db.prepare('SELECT subject, body FROM email_templates WHERE id = ? AND business_id = ?').get(data.template_id, businessId) as any;
        if (template) {
          db.prepare('INSERT INTO email_logs (id, business_id, client_id, subject, body) VALUES (?, ?, ?, ?, ?)').run(
            generateId(),
            businessId,
            data.client_id,
            template.subject,
            template.body
          );
        }
      }
    });
    
    runTransaction();
    
    return { success: true, id: flowId };
  });

export const updateTaskStatus = createServerFn({ method: 'POST' })
  .validator((data: { sessionId: string; flowId: string; taskId: string; completed: boolean }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    // Check ownership
    const flow = db.prepare('SELECT id FROM onboarding_flows WHERE id = ? AND business_id = ?').get(data.flowId, businessId);
    if (!flow) throw new Error('Flow not found');
    
    db.prepare('UPDATE flow_tasks SET completed = ? WHERE id = ? AND flow_id = ?').run(
      data.completed ? 1 : 0,
      data.taskId,
      data.flowId
    );
    
    // Update progress_pct
    const tasks = db.prepare('SELECT completed FROM flow_tasks WHERE flow_id = ?').all(data.flowId) as { completed: number }[];
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    
    db.prepare('UPDATE onboarding_flows SET progress_pct = ? WHERE id = ?').run(progress, data.flowId);
    
    return { success: true, progress_pct: progress };
  });
