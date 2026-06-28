import { createServerFn } from '@tanstack/react-start';
import db from './db';

const generateId = () => crypto.randomUUID();

async function getBusinessId(sessionId: string) {
  const session = db.prepare('SELECT business_id FROM sessions WHERE id = ? AND expires_at > ?').get(sessionId, new Date().toISOString()) as { business_id: string } | undefined;
  return session?.business_id;
}

export const getChecklists = createServerFn({ method: 'GET' })
  .validator((data: { sessionId: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    const checklists = db.prepare('SELECT * FROM checklists WHERE business_id = ? ORDER BY created_at DESC').all(businessId) as any[];
    
    for (const checklist of checklists) {
      checklist.tasks = db.prepare('SELECT * FROM checklist_tasks WHERE checklist_id = ? ORDER BY order_index ASC').all(checklist.id);
    }
    
    return checklists;
  });

export const addChecklist = createServerFn({ method: 'POST' })
  .validator((data: { sessionId: string; name: string; tasks: string[] }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    const checklistId = generateId();
    
    // Transactional insert
    const insertChecklist = db.prepare('INSERT INTO checklists (id, business_id, name) VALUES (?, ?, ?)');
    const insertTask = db.prepare('INSERT INTO checklist_tasks (id, checklist_id, task_name, order_index) VALUES (?, ?, ?, ?)');
    
    const runTransaction = db.transaction(() => {
      insertChecklist.run(checklistId, businessId, data.name);
      data.tasks.forEach((taskName, index) => {
        insertTask.run(generateId(), checklistId, taskName, index);
      });
    });
    
    runTransaction();
    
    return { success: true, id: checklistId };
  });

export const updateChecklist = createServerFn({ method: 'POST' })
  .validator((data: { sessionId: string; id: string; name: string; tasks: string[] }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    const checklist = db.prepare('SELECT id FROM checklists WHERE id = ? AND business_id = ?').get(data.id, businessId);
    if (!checklist) throw new Error('Checklist not found');
    
    const updateChecklist = db.prepare('UPDATE checklists SET name = ? WHERE id = ?');
    const deleteTasks = db.prepare('DELETE FROM checklist_tasks WHERE checklist_id = ?');
    const insertTask = db.prepare('INSERT INTO checklist_tasks (id, checklist_id, task_name, order_index) VALUES (?, ?, ?, ?)');
    
    const runTransaction = db.transaction(() => {
      updateChecklist.run(data.name, data.id);
      deleteTasks.run(data.id);
      data.tasks.forEach((taskName, index) => {
        insertTask.run(generateId(), data.id, taskName, index);
      });
    });
    
    runTransaction();
    
    return { success: true };
  });

export const deleteChecklist = createServerFn({ method: 'POST' })
  .validator((data: { sessionId: string; id: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    const deleteChecklist = db.prepare('DELETE FROM checklists WHERE id = ? AND business_id = ?');
    const deleteTasks = db.prepare('DELETE FROM checklist_tasks WHERE checklist_id = ?');
    
    const runTransaction = db.transaction(() => {
      deleteTasks.run(data.id);
      deleteChecklist.run(data.id, businessId);
    });
    
    runTransaction();
    
    return { success: true };
  });
