import "server-only";
import { createServiceClient } from "@/lib/supabase/service";

type AuditEntry = {
  actorId: string;
  action: string; // e.g. 'user.promote', 'team.approve'
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
};

// Call this only after the action has been authorized. A logging failure is
// recorded but does not undo or block the action.
export async function logAudit(entry: AuditEntry) {
  const { error } = await createServiceClient().from("audit_logs").insert({
    actor_id: entry.actorId,
    action: entry.action,
    target_type: entry.targetType ?? null,
    target_id: entry.targetId ?? null,
    metadata: entry.metadata ?? {},
  });

  if (error) console.error("audit_log_failed", error.message);
}
