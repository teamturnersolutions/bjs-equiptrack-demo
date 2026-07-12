import { prisma } from '@/lib/prisma';
import { MemberList } from './_components/member-list';

export const metadata = {
  title: "Team Members | BJ's EquipTrack",
};

export default async function MembersPage() {
  const members = await prisma.teamMember.findMany({
    include: {
      inventoryItems: {
        where: {
          status: 'Checked Out'
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  const membersWithCounts = members.map(m => ({
    id: m.id,
    name: m.name,
    activeItemsCount: m.inventoryItems.length
  }));

  return <MemberList members={membersWithCounts} />;
}
