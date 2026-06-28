import { createServerFn } from '@tanstack/react-start';
import db from './db';

// Since I don't know if uuid is installed, I'll use crypto.randomUUID()
const generateId = () => crypto.randomUUID();

export const signup = createServerFn({ method: 'POST' })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const id = generateId();
    const password_hash = await Bun.password.hash(data.password);
    try {
      db.prepare(`
        INSERT INTO businesses (id, email, password_hash)
        VALUES (?, ?, ?)
      `).run(id, data.email, password_hash);
      
      return { success: true, businessId: id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const login = createServerFn({ method: 'POST' })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const business = db.prepare('SELECT * FROM businesses WHERE email = ?').get(data.email) as any;
    
    if (!business || !(await Bun.password.verify(data.password, business.password_hash))) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    const sessionId = generateId();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days
    
    db.prepare('INSERT INTO sessions (id, business_id, expires_at) VALUES (?, ?, ?)').run(
      sessionId,
      business.id,
      expiresAt
    );
    
    return { success: true, sessionId, business };
  });

export const verifySession = createServerFn({ method: 'POST' })
  .validator((data: { sessionId: string }) => data)
  .handler(async ({ data }) => {
    const session = db.prepare(`
      SELECT s.*, b.name, b.email, b.industry 
      FROM sessions s 
      JOIN businesses b ON s.business_id = b.id 
      WHERE s.id = ? AND s.expires_at > ?
    `).get(data.sessionId, new Date().toISOString()) as any;
    
    if (!session) {
      return { success: false };
    }
    
    return { success: true, business: { id: session.business_id, name: session.name, email: session.email, industry: session.industry } };
  });

export const logout = createServerFn({ method: 'POST' })
  .validator((data: { sessionId: string }) => data)
  .handler(async ({ data }) => {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(data.sessionId);
    return { success: true };
  });
