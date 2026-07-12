import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/services/rbac";

export async function GET() {
  try {
    // Authorize read access
    await requirePermission("equipment.read");

    const items = await prisma.inventoryItem.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ success: true, items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authentication required.";
    return NextResponse.json({ success: false, message }, { status: 401 });
  }
}
