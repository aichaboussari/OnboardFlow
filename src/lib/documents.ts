import { createServerFn } from '@tanstack/react-start';
import db from './db';
import fs from 'node:fs/promises';
import path from 'node:path';

const generateId = () => crypto.randomUUID();

async function getBusinessId(sessionId: string) {
  const session = db.prepare('SELECT business_id FROM sessions WHERE id = ? AND expires_at > ?').get(sessionId, new Date().toISOString()) as { business_id: string } | undefined;
  return session?.business_id;
}

export const uploadDocument = createServerFn({ method: 'POST' })
  .validator((data: { sessionId: string; flowId: string; fileName: string; fileContent: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');

    // Verify flow ownership
    const flow = db.prepare('SELECT id FROM onboarding_flows WHERE id = ? AND business_id = ?').get(data.flowId, businessId);
    if (!flow) throw new Error('Flow not found');

    const uploadDir = path.join(process.cwd(), 'uploads', data.flowId);
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, data.fileName);
    const buffer = Buffer.from(data.fileContent, 'base64');
    await fs.writeFile(filePath, buffer);

    const id = generateId();
    db.prepare('INSERT INTO documents (id, flow_id, name, file_path, signed) VALUES (?, ?, ?, ?, ?)').run(
      id,
      data.flowId,
      data.fileName,
      filePath,
      0
    );

    return { success: true, id };
  });

export const getDocument = createServerFn({ method: 'GET' })
  .validator((data: { sessionId: string; documentId: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');

    const doc = db.prepare(`
      SELECT d.* 
      FROM documents d
      JOIN onboarding_flows f ON d.flow_id = f.id
      WHERE d.id = ? AND f.business_id = ?
    `).get(data.documentId, businessId) as { name: string, file_path: string } | undefined;

    if (!doc) throw new Error('Document not found');

    const buffer = await fs.readFile(doc.file_path);
    return {
      fileName: doc.name,
      fileContent: buffer.toString('base64'),
    };
  });

export const addDocument = createServerFn({ method: 'POST' })
  .validator((data: { sessionId: string; flow_id: string; name: string; file_path: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    // Verify flow ownership
    const flow = db.prepare('SELECT id FROM onboarding_flows WHERE id = ? AND business_id = ?').get(data.flow_id, businessId);
    if (!flow) throw new Error('Flow not found');
    
    const id = generateId();
    db.prepare('INSERT INTO documents (id, flow_id, name, file_path, signed) VALUES (?, ?, ?, ?, ?)').run(
      id,
      data.flow_id,
      data.name,
      data.file_path,
      0
    );
    
    return { success: true, id };
  });

export const signDocument = createServerFn({ method: 'POST' })
  .validator((data: { sessionId: string; documentId: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    // Join with flows to verify ownership
    const doc = db.prepare(`
      SELECT d.id 
      FROM documents d
      JOIN onboarding_flows f ON d.flow_id = f.id
      WHERE d.id = ? AND f.business_id = ?
    `).get(data.documentId, businessId);
    
    if (!doc) throw new Error('Document not found');
    
    db.prepare('UPDATE documents SET signed = 1, signed_at = CURRENT_TIMESTAMP WHERE id = ?').run(data.documentId);
    
    return { success: true };
  });

export const deleteDocument = createServerFn({ method: 'POST' })
  .validator((data: { sessionId: string; documentId: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    const doc = db.prepare(`
      SELECT d.id 
      FROM documents d
      JOIN onboarding_flows f ON d.flow_id = f.id
      WHERE d.id = ? AND f.business_id = ?
    `).get(data.documentId, businessId);
    
    if (!doc) throw new Error('Document not found');
    
    db.prepare('DELETE FROM documents WHERE id = ?').run(data.documentId);
    
    return { success: true };
  });
