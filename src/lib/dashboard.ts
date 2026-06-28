import { createServerFn } from '@tanstack/react-start';
import db from './db';

async function getBusinessId(sessionId: string) {
  const session = db.prepare('SELECT business_id FROM sessions WHERE id = ? AND expires_at > ?').get(sessionId, new Date().toISOString()) as { business_id: string } | undefined;
  return session?.business_id;
}

export const getDashboardStats = createServerFn({ method: 'GET' })
  .validator((data: { sessionId: string }) => data)
  .handler(async ({ data }) => {
    const businessId = await getBusinessId(data.sessionId);
    if (!businessId) throw new Error('Unauthorized');
    
    // Active flows
    const activeFlows = db.prepare("SELECT COUNT(*) as count FROM onboarding_flows WHERE business_id = ? AND status = 'active'").get(businessId) as { count: number };
    
    // Clients this month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    const clientsThisMonth = db.prepare("SELECT COUNT(*) as count FROM clients WHERE business_id = ? AND created_at >= ?").get(businessId, firstDayOfMonth.toISOString()) as { count: number };
    
    // Completion rate
    const completedFlows = db.prepare("SELECT COUNT(*) as count FROM onboarding_flows WHERE business_id = ? AND status = 'completed'").get(businessId) as { count: number };
    const totalFlows = db.prepare("SELECT COUNT(*) as count FROM onboarding_flows WHERE business_id = ?").get(businessId) as { count: number };
    const completionRate = totalFlows.count > 0 ? (completedFlows.count / totalFlows.count) * 100 : 0;
    
    // Recent activity (last 5)
    // We'll combine onboarding_flows creations and document signings
    const flows = db.prepare(`
      SELECT 'flow_created' as type, f.created_at as date, c.name as client_name
      FROM onboarding_flows f
      JOIN clients c ON f.client_id = c.id
      WHERE f.business_id = ?
      ORDER BY f.created_at DESC
      LIMIT 5
    `).all(businessId) as any[];

    const docs = db.prepare(`
      SELECT 'document_signed' as type, d.signed_at as date, c.name as client_name, d.name as doc_name
      FROM documents d
      JOIN onboarding_flows f ON d.flow_id = f.id
      JOIN clients c ON f.client_id = c.id
      WHERE f.business_id = ? AND d.signed = 1
      ORDER BY d.signed_at DESC
      LIMIT 5
    `).all(businessId) as any[];

    const activity = [...flows, ...docs]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    
    return {
      activeFlows: activeFlows.count,
      clientsThisMonth: clientsThisMonth.count,
      completionRate: Math.round(completionRate),
      recentActivity: activity
    };
  });
