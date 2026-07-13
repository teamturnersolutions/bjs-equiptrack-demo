import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/services/rbac";
import { logAuditEvent } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    // 1. Authorize the user
    const actor = await requirePermission("equipment.update");
    const actorId = actor?.id ? parseInt(actor.id) : null;
    const actorName = actor?.name || "System / Admin";

    const body = await req.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json({ success: false, message: "Invalid payload format." }, { status: 400 });
    }

    // 2. Perform transaction
    await prisma.$transaction(async (tx) => {
      // 2a. Identify and perform deletions
      const existingItems = await tx.inventoryItem.findMany({
        select: { id: true, name: true, status: true, assetNumber: true, serialNumber: true }
      });
      const existingIds = existingItems.map((item) => item.id);
      
      const incomingIds = new Set(
        items.map((item: any) => item.id).filter((id: any) => typeof id === 'number' && !isNaN(id))
      );

      const idsToDelete = existingIds.filter((id) => !incomingIds.has(id));

      if (idsToDelete.length > 0) {
        // Delete dependent RepairRecords first to avoid foreign key violations
        await tx.repairRecord.deleteMany({
          where: { itemId: { in: idsToDelete } }
        });

        // Audit the deletions
        for (const id of idsToDelete) {
          const itemToDelete = existingItems.find((x) => x.id === id);
          if (itemToDelete) {
            await logAuditEvent({
              actorId,
              actorName,
              entity: "InventoryItem",
              action: "DELETE",
              prevValue: itemToDelete,
              newValue: null,
              notes: "Deleted via Univer Administrative Workspace",
            });
          }
        }

        // Delete inventory items
        await tx.inventoryItem.deleteMany({
          where: { id: { in: idsToDelete } }
        });
      }

      // 2b. Handle updates and additions
      for (const item of items) {
        if (item.id) {
          // Update existing item
          const previous = await tx.inventoryItem.findUnique({
            where: { id: item.id }
          });

          if (!previous) continue;

          // Skip if no actual changes
          const hasChanges = 
            previous.name !== item.name ||
            previous.assetNumber !== item.assetNumber ||
            previous.serialNumber !== item.serialNumber ||
            previous.status !== item.status;

          if (!hasChanges) continue;

          const updated = await tx.inventoryItem.update({
            where: { id: item.id },
            data: {
              name: item.name || previous.name,
              assetNumber: item.assetNumber ?? previous.assetNumber,
              serialNumber: item.serialNumber ?? previous.serialNumber,
              status: item.status || previous.status,
            }
          });

          // Log audit event
          await logAuditEvent({
            actorId,
            actorName,
            entity: "InventoryItem",
            action: "UPDATE",
            prevValue: previous,
            newValue: updated,
            notes: "Updated via Univer Administrative Workspace",
          });

          // Log user-visible correct log
          await tx.inventoryLog.create({
            data: {
              itemId: item.id,
              itemName: updated.name,
              action: "CORRECT",
              teamMemberId: null,
              teamMemberName: "System / Univer Admin",
            }
          });
        } else {
          // Create new item
          const created = await tx.inventoryItem.create({
            data: {
              name: item.name || "Unnamed Item",
              assetNumber: item.assetNumber || null,
              serialNumber: item.serialNumber || null,
              status: item.status || "Available",
            }
          });

          // Log audit event
          await logAuditEvent({
            actorId,
            actorName,
            entity: "InventoryItem",
            action: "CREATE",
            prevValue: null,
            newValue: created,
            notes: "Created via Univer Administrative Workspace",
          });

          // Log inventory log
          await tx.inventoryLog.create({
            data: {
              itemId: created.id,
              itemName: created.name,
              action: "CORRECT",
              teamMemberId: null,
              teamMemberName: "System / Univer Admin",
            }
          });
        }
      }
    });

    revalidatePath("/");
    revalidatePath("/inventory");
    revalidatePath("/checkout");
    revalidatePath("/checkin");
    revalidatePath("/history");

    return NextResponse.json({ success: true, message: "Bulk inventory changes saved successfully!" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error occurred.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
