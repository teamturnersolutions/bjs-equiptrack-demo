import { z } from "zod";

export const addTeamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  department: z.string().optional(),
  status: z.string().optional(),
});

export const addInventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  assetNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  locationId: z.number().int().positive().optional(),
});

export const checkoutSchema = z.object({
  teamMemberId: z.number().int().positive(),
  itemIds: z.array(z.number().int().positive()).min(1, "At least one item must be selected"),
});

export const checkinSchema = z.object({
  itemIds: z.array(z.number().int().positive()).min(1, "At least one item must be selected"),
});

export const createRepairSchema = z.object({
  itemId: z.number().int().positive(),
  category: z.enum(["Physical Damage", "Screen", "Battery", "Scanner", "Keyboard", "Charging", "Software", "Network", "Missing Parts", "Other"]),
  severity: z.enum(["Low", "Medium", "High", "Critical"]),
  description: z.string().min(1, "Description is required"),
});

export const resolveRepairSchema = z.object({
  repairId: z.number().int().positive(),
  resolution: z.string().min(1, "Resolution is required"),
});
