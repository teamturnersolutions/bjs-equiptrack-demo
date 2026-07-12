import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/services/rbac";

export async function GET(req: NextRequest) {
  try {
    // 1. Authorize
    await requirePermission("equipment.read");
    
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (query.trim() === "") {
      return NextResponse.json({ success: true, items: [], members: [], repairs: [] });
    }

    const term = query.trim();

    // 2. Search Inventory Items
    const items = await prisma.inventoryItem.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { assetNumber: { contains: term, mode: "insensitive" } },
          { serialNumber: { contains: term, mode: "insensitive" } },
          { checkedOutBy: { contains: term, mode: "insensitive" } },
          { status: { contains: term, mode: "insensitive" } },
        ]
      },
      take: 10,
    });

    // 3. Search Team Members
    const members = await prisma.teamMember.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { department: { contains: term, mode: "insensitive" } },
        ]
      },
      take: 10,
    });

    // 4. Search Repair Tickets
    const repairs = await prisma.repairRecord.findMany({
      where: {
        OR: [
          { description: { contains: term, mode: "insensitive" } },
          { category: { contains: term, mode: "insensitive" } },
          { status: { contains: term, mode: "insensitive" } },
        ]
      },
      include: { item: true },
      take: 10,
    });

    return NextResponse.json({ success: true, items, members, repairs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error executing search.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
