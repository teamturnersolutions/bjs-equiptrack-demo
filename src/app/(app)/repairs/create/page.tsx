import { prisma } from "@/lib/prisma";
import { CreateRepairClient } from "./create-repair-client";

export const metadata = {
  title: "Tag Out Device | BJ's EquipTrack",
};

export default async function CreateRepairPage() {
  const items = await prisma.inventoryItem.findMany({
    where: {
      status: {
        not: "Tagged Out"
      }
    },
    orderBy: {
      name: "asc"
    }
  });

  return <CreateRepairClient items={items} />;
}
