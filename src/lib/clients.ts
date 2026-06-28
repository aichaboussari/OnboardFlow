import { createServerFn } from '@tanstack/react-start';
import db from './db';

const generateId = () => crypto.randomUUID();

async function getBusinessId(sessionId: string) {
  const session = db.prepare('SELECT business_id FROM sessions WHERE id = ? AND expires_at > ?').get(sessionId, new Date().toISOString()) as { business_id: string } | undefined;
  return session?.business_id;
}

export const getClients = createServerFn({ method: 'GET' })
  .validator((data: { sessionId: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    const clients = db.prepare('SELECT * FROM clients WHERE business_id = ? ORDER BY created_at DESC').all(businessId);
    return clients;
  });

export const addClient = createServerFn({ method: 'POST' })
  .validator((data: { sessionId: string; name: string; email: string; notes?: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    const id = generateId();
    db.prepare('INSERT INTO clients (id, business_id, name, email, notes) VALUES (?, ?, ?, ?, ?)').run(
      id,
      businessId,
      data.name,
      data.email,
      data.notes || ''
    );
    
    return { success: true, id };
  });

export const deleteClient = createServerFn({ method: 'POST' })
  .validator((data: { sessionId: string; id: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    // Check if client belongs to business
    const client = db.prepare('SELECT id FROM clients WHERE id = ? AND business_id = ?').get(data.id, businessId);
    if (!client) throw new Error('Client not found');
    
    db.prepare('DELETE FROM clients WHERE id = ?').run(data.id);
    return { success: true };
  });
