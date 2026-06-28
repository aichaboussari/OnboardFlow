import { createServerFn } from '@tanstack/react-start';
import db from './db';

const generateId = () => crypto.randomUUID();

async function getBusinessId(sessionId: string) {
  const session = db.prepare('SELECT business_id FROM sessions WHERE id = ? AND expires_at > ?').get(sessionId, new Date().toISOString()) as { business_id: string } | undefined;
  return session?.business_id;
}

export const getTemplates = createServerFn({ method: 'GET' })
  .validator((data: { sessionId: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    return db.prepare('SELECT * FROM email_templates WHERE business_id = ? ORDER BY created_at DESC').all(businessId);
  });

export const addTemplate = createServerFn({ method: 'POST' })
  .validator((data: { sessionId: string; name: string; subject: string; body: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    const id = generateId();
    db.prepare('INSERT INTO email_templates (id, business_id, name, subject, body) VALUES (?, ?, ?, ?, ?)').run(
      id,
      businessId,
      data.name,
      data.subject,
      data.body
    );
    
    return { success: true, id };
  });

export const updateTemplate = createServerFn({ method: 'POST' })
  .validator((data: { sessionId: string; id: string; name: string; subject: string; body: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    db.prepare('UPDATE email_templates SET name = ?, subject = ?, body = ? WHERE id = ? AND business_id = ?').run(
      data.name,
      data.subject,
      data.body,
      data.id,
      businessId
    );
    
    return { success: true };
  });

export const deleteTemplate = createServerFn({ method: 'POST' })
  .validator((data: { sessionId: string; id: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    db.prepare('DELETE FROM email_templates WHERE id = ? AND business_id = ?').run(data.id, businessId);
    return { success: true };
  });
