import { prisma } from "../prisma";

export type AuditLogEntry = {
  actorId?: number | null;
  actorName?: string | null;
  entity: string;
  action: string;
  prevValue?: any;
  newValue?: any;
  notes?: string | null;
};

export async function logAuditEvent({
  actorId,
  actorName,
  entity,
  action,
  prevValue,
  newValue,
  notes,
}: AuditLogEntry) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        actorName,
        entity,
        action,
        prevValue: prevValue ? JSON.stringify(prevValue) : null,
        newValue: newValue ? JSON.stringify(newValue) : null,
        notes,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
