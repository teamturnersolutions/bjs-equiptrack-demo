'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requirePermission } from '@/lib/services/rbac';
import { logAuditEvent } from '@/lib/services/audit';
import {
  addTeamMemberSchema,
  addInventoryItemSchema,
  checkoutSchema,
  checkinSchema,
  createRepairSchema,
  resolveRepairSchema
} from '@/lib/services/validation';

// Helper to get actor information
async function getActorInfo() {
  const actor = await getCurrentUser();
  return {
    actorId: actor?.id ? parseInt(actor.id) : null,
    actorName: actor?.name || 'System / Admin',
  };
}

export async function addTeamMember(name: string) {
  try {
    const actor = await requirePermission('employee.update');
    const { actorId, actorName } = await getActorInfo();

    // Validate inputs
    addTeamMemberSchema.parse({ name });

    const created = await prisma.teamMember.create({
      data: { name, department: 'Operations', status: 'Active' },
    });

    await logAuditEvent({
      actorId,
      actorName,
      entity: 'TeamMember',
      action: 'CREATE',
      newValue: created,
    });

    revalidatePath('/');
    revalidatePath('/checkout');
    revalidatePath('/history');
    revalidatePath('/members');
    return { success: true, message: 'Team member added successfully!' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message };
  }
}

export async function addInventoryItem(name: string) {
  try {
    const actor = await requirePermission('equipment.create');
    const { actorId, actorName } = await getActorInfo();

    // Validate inputs
    addInventoryItemSchema.parse({ name });

    // Find a default location to attach
    const defaultLocation = await prisma.location.findFirst();

    const created = await prisma.inventoryItem.create({
      data: {
        name,
        status: 'Available',
        assetNumber: `AST-${Math.floor(100000 + Math.random() * 900000)}`,
        serialNumber: `SN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        locationId: defaultLocation?.id || null,
      },
    });

    await logAuditEvent({
      actorId,
      actorName,
      entity: 'InventoryItem',
      action: 'CREATE',
      newValue: created,
    });

    revalidatePath('/');
    revalidatePath('/inventory');
    revalidatePath('/checkout');
    revalidatePath('/history');
    return { success: true, message: 'Inventory item added successfully!' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message };
  }
}

export async function checkOutEquipment(teamMemberId: number, itemIds: number[]) {
  try {
    const actor = await requirePermission('equipment.update');
    const { actorId, actorName } = await getActorInfo();

    // Validate inputs
    checkoutSchema.parse({ teamMemberId, itemIds });

    const teamMember = await prisma.teamMember.findUnique({
      where: { id: teamMemberId },
    });
    if (!teamMember) {
      throw new Error('Team member not found.');
    }

    // Atomic transaction for concurrency safety
    const result = await prisma.$transaction(async (tx) => {
      const items = await tx.inventoryItem.findMany({
        where: { id: { in: itemIds } },
      });

      if (items.length !== itemIds.length) {
        throw new Error('One or more items do not exist.');
      }

      if (items.some(item => item.status !== 'Available')) {
        throw new Error('One or more selected items are not available.');
      }

      const updatedItems = [];
      const timestamp = new Date().toISOString();

      for (const item of items) {
        const updated = await tx.inventoryItem.update({
          where: { id: item.id },
          data: {
            status: 'Checked Out',
            checkedOutBy: teamMember.name,
            checkedOutById: teamMember.id,
            checkedOutDate: timestamp,
            checkedInDate: null,
          },
        });
        updatedItems.push(updated);

        // Create checkout record in user log
        await tx.inventoryLog.create({
          data: {
            itemId: item.id,
            itemName: item.name,
            action: 'CHECKOUT',
            teamMemberId: teamMember.id,
            teamMemberName: teamMember.name,
          },
        });

        // Create enterprise audit log
        await logAuditEvent({
          actorId,
          actorName,
          entity: 'InventoryItem',
          action: 'CHECKOUT',
          prevValue: item,
          newValue: updated,
          notes: `Checked out to ${teamMember.name}`,
        });
      }

      return updatedItems;
    });

    revalidatePath('/inventory');
    revalidatePath('/checkout');
    revalidatePath('/checkin');
    revalidatePath('/');
    revalidatePath('/history');
    revalidatePath('/members');

    return { success: true, message: 'Equipment checked out successfully!' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message };
  }
}

export async function checkInEquipment(itemIds: number[]) {
  try {
    const actor = await requirePermission('equipment.update');
    const { actorId, actorName } = await getActorInfo();

    // Validate inputs
    checkinSchema.parse({ itemIds });

    // Atomic transaction for return operations
    await prisma.$transaction(async (tx) => {
      const items = await tx.inventoryItem.findMany({
        where: { id: { in: itemIds } },
      });

      if (items.length !== itemIds.length) {
        throw new Error('One or more items do not exist.');
      }

      if (items.some(item => item.status === 'Available')) {
        throw new Error('One or more selected items are already available.');
      }

      const timestamp = new Date().toISOString();

      for (const item of items) {
        const updated = await tx.inventoryItem.update({
          where: { id: item.id },
          data: {
            status: 'Available',
            checkedOutBy: null,
            checkedOutById: null,
            checkedOutDate: null,
            checkedInDate: timestamp,
          },
        });

        // User-facing log
        await tx.inventoryLog.create({
          data: {
            itemId: item.id,
            itemName: item.name,
            action: 'CHECKIN',
            teamMemberId: item.checkedOutById,
            teamMemberName: item.checkedOutBy,
          },
        });

        // Enterprise audit log
        await logAuditEvent({
          actorId,
          actorName,
          entity: 'InventoryItem',
          action: 'CHECKIN',
          prevValue: item,
          newValue: updated,
          notes: `Checked in (previously held by ${item.checkedOutBy})`,
        });
      }
    });

    revalidatePath('/inventory');
    revalidatePath('/checkin');
    revalidatePath('/checkout');
    revalidatePath('/');
    revalidatePath('/history');
    revalidatePath('/members');

    return { success: true, message: 'Equipment checked in successfully!' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message };
  }
}

export async function bulkAddTeamMembers(members: { name: string }[]) {
  try {
    const actor = await requirePermission('employee.update');
    const { actorId, actorName } = await getActorInfo();

    const createdList = [];
    for (const m of members) {
      if (!m.name) continue;
      const existing = await prisma.teamMember.findFirst({
        where: { name: m.name },
      });
      if (!existing) {
        const created = await prisma.teamMember.create({
          data: { name: m.name, department: 'Operations', status: 'Active' },
        });
        createdList.push(created);

        await logAuditEvent({
          actorId,
          actorName,
          entity: 'TeamMember',
          action: 'CREATE',
          newValue: created,
          notes: 'Bulk import',
        });
      }
    }

    revalidatePath('/');
    revalidatePath('/checkout');
    revalidatePath('/history');
    revalidatePath('/members');
    return { success: true, message: `Successfully imported ${createdList.length} team members!` };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to import team members.';
    return { success: false, message };
  }
}

export async function bulkAddInventoryItems(items: { name: string; status?: string }[]) {
  try {
    const actor = await requirePermission('equipment.create');
    const { actorId, actorName } = await getActorInfo();

    const createdList = [];
    const defaultLocation = await prisma.location.findFirst();

    for (const i of items) {
      if (!i.name) continue;
      const existing = await prisma.inventoryItem.findFirst({
        where: { name: i.name },
      });
      if (!existing) {
        const created = await prisma.inventoryItem.create({
          data: {
            name: i.name,
            status: i.status || 'Available',
            assetNumber: `AST-${Math.floor(100000 + Math.random() * 900000)}`,
            serialNumber: `SN-${Math.floor(10000000 + Math.random() * 90000000)}`,
            locationId: defaultLocation?.id || null,
          },
        });
        createdList.push(created);

        await logAuditEvent({
          actorId,
          actorName,
          entity: 'InventoryItem',
          action: 'CREATE',
          newValue: created,
          notes: 'Bulk import',
        });
      }
    }

    revalidatePath('/');
    revalidatePath('/inventory');
    revalidatePath('/history');
    return { success: true, message: `Successfully imported ${createdList.length} inventory items!` };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to import inventory items.';
    return { success: false, message };
  }
}

export async function updateInventoryItem(id: number, name: string) {
  try {
    const actor = await requirePermission('equipment.update');
    const { actorId, actorName } = await getActorInfo();

    if (!name || name.trim() === '') {
      throw new Error('Item name cannot be empty.');
    }
    const trimmedName = name.trim();

    const previous = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    const updated = await prisma.inventoryItem.update({
      where: { id },
      data: { name: trimmedName },
    });

    await prisma.inventoryLog.create({
      data: {
        itemId: id,
        itemName: trimmedName,
        action: 'CORRECT',
        teamMemberId: null,
        teamMemberName: 'System / Admin',
      },
    });

    await logAuditEvent({
      actorId,
      actorName,
      entity: 'InventoryItem',
      action: 'UPDATE',
      prevValue: previous,
      newValue: updated,
    });

    revalidatePath('/');
    revalidatePath('/inventory');
    revalidatePath('/checkout');
    revalidatePath('/checkin');
    revalidatePath('/history');
    return { success: true, message: 'Inventory item updated successfully!' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message };
  }
}

export async function updateTeamMember(id: number, name: string) {
  try {
    const actor = await requirePermission('employee.update');
    const { actorId, actorName } = await getActorInfo();

    if (!name || name.trim() === '') {
      throw new Error('Name cannot be empty.');
    }
    const trimmedName = name.trim();

    const previous = await prisma.teamMember.findUnique({
      where: { id },
    });

    const [updatedMember] = await prisma.$transaction([
      prisma.teamMember.update({
        where: { id },
        data: { name: trimmedName },
      }),
      prisma.inventoryItem.updateMany({
        where: { checkedOutById: id },
        data: { checkedOutBy: trimmedName },
      }),
    ]);

    await logAuditEvent({
      actorId,
      actorName,
      entity: 'TeamMember',
      action: 'UPDATE',
      prevValue: previous,
      newValue: updatedMember,
    });

    revalidatePath('/');
    revalidatePath('/checkout');
    revalidatePath('/checkin');
    revalidatePath('/inventory');
    revalidatePath('/history');
    revalidatePath('/members');
    return { success: true, message: 'Team member updated successfully!' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message };
  }
}

// --- Tag Out & Repairs Module Actions ---

export async function createRepairTicket(itemId: number, category: any, severity: any, description: string) {
  try {
    const actor = await requirePermission('repair.create');
    const { actorId, actorName } = await getActorInfo();

    // Validate using Zod schema
    createRepairSchema.parse({ itemId, category, severity, description });

    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findUnique({
        where: { id: itemId },
      });

      if (!item) {
        throw new Error('Equipment not found.');
      }

      // Check if already tagged out
      if (item.status === 'Tagged Out') {
        throw new Error('Equipment is already tagged out.');
      }

      // Update item status
      const updatedItem = await tx.inventoryItem.update({
        where: { id: itemId },
        data: {
          status: 'Tagged Out',
          checkedOutBy: null,
          checkedOutById: null,
          checkedOutDate: null,
        },
      });

      // Create repair ticket
      const ticket = await tx.repairRecord.create({
        data: {
          itemId,
          reporterId: actorId,
          category,
          severity,
          description,
          status: 'Tagged Out',
        },
      });

      // Log audit
      await logAuditEvent({
        actorId,
        actorName,
        entity: 'RepairRecord',
        action: 'TAG_OUT',
        newValue: ticket,
        notes: `Tagged Out asset "${item.name}" (SN: ${item.serialNumber || 'N/A'})`,
      });

      // Trigger user log
      await tx.inventoryLog.create({
        data: {
          itemId,
          itemName: item.name,
          action: 'CORRECT',
          teamMemberId: null,
          teamMemberName: `System / Tag Out`,
        },
      });

      return ticket;
    });

    revalidatePath('/');
    revalidatePath('/inventory');
    revalidatePath('/checkout');
    revalidatePath('/checkin');
    revalidatePath('/history');
    revalidatePath('/repairs');

    return { success: true, message: 'Equipment tagged out and repair ticket created!' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message };
  }
}

export async function resolveRepairTicket(repairId: number, resolution: string) {
  try {
    const actor = await requirePermission('repair.close');
    const { actorId, actorName } = await getActorInfo();

    // Validate
    resolveRepairSchema.parse({ repairId, resolution });

    await prisma.$transaction(async (tx) => {
      const ticket = await tx.repairRecord.findUnique({
        where: { id: repairId },
        include: { item: true },
      });

      if (!ticket) {
        throw new Error('Repair ticket not found.');
      }

      if (ticket.status === 'Returned to Service') {
        throw new Error('Repair ticket is already resolved.');
      }

      const timestamp = new Date();

      // Update ticket
      const updatedTicket = await tx.repairRecord.update({
        where: { id: repairId },
        data: {
          status: 'Returned to Service',
          resolution,
          resolutionDate: timestamp,
          technicianId: actorId,
        },
      });

      // Reset equipment state
      const updatedItem = await tx.inventoryItem.update({
        where: { id: ticket.itemId },
        data: {
          status: 'Available',
        },
      });

      // Log audit
      await logAuditEvent({
        actorId,
        actorName,
        entity: 'RepairRecord',
        action: 'REPAIR_COMPLETE',
        prevValue: ticket,
        newValue: updatedTicket,
        notes: `Resolved repair for asset "${ticket.item.name}". Resolution: ${resolution}`,
      });

      // Log user visible correction
      await tx.inventoryLog.create({
        data: {
          itemId: ticket.itemId,
          itemName: ticket.item.name,
          action: 'CORRECT',
          teamMemberId: null,
          teamMemberName: `System / Repair Complete`,
        },
      });
    });

    revalidatePath('/');
    revalidatePath('/inventory');
    revalidatePath('/checkout');
    revalidatePath('/checkin');
    revalidatePath('/history');
    revalidatePath('/repairs');

    return { success: true, message: 'Repair ticket resolved and equipment returned to service!' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message };
  }
}
