import { prisma } from "@/lib/prisma";
import { RepairsClient } from "./repairs-client";

export const metadata = {
  title: "Repairs & Tag Out | BJ's EquipTrack",
};

export default async function RepairsPage() {
  const tickets = await prisma.repairRecord.findMany({
    include: {
      item: true,
      reporter: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <RepairsClient tickets={tickets} />;
}
