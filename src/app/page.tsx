import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  PackageSearch,
  PackageCheck,
  LayoutGrid,
  History as HistoryIcon,
  Users,
  Wrench,
  FileSpreadsheet,
  BarChart3,
  Search,
  ShieldAlert
} from 'lucide-react';
import { HomeManagementControls } from './_components/home-management-controls';

const primaryOps = [
  {
    href: '/checkout',
    icon: <PackageSearch className="size-8 text-[#ff1744]" />,
    title: 'Check Out Equipment',
    description: 'Assign hardware to team members.',
  },
  {
    href: '/checkin',
    icon: <PackageCheck className="size-8 text-[#ff1744]" />,
    title: 'Check In Equipment',
    description: 'Return hardware back to inventory.',
  },
  {
    href: '/repairs',
    icon: <Wrench className="size-8 text-[#ff1744]" />,
    title: 'Repairs & Tag Out',
    description: 'Tag out broken devices and manage repairs.',
  },
];

const managementOps = [
  {
    href: '/inventory',
    icon: <LayoutGrid className="size-8 text-[#3178c6]" />,
    title: 'View Inventory',
    description: 'Browse all items and current statuses.',
  },
  {
    href: '/members',
    icon: <Users className="size-8 text-[#3178c6]" />,
    title: 'Team Members',
    description: 'Manage the team roster and update profiles.',
  },
  {
    href: '/admin/workspace',
    icon: <FileSpreadsheet className="size-8 text-[#3178c6]" />,
    title: 'Spreadsheet Workspace',
    description: 'Excel-like bulk inventory editor (Univer).',
  },
];

const analyticsOps = [
  {
    href: '/dashboard',
    icon: <BarChart3 className="size-8 text-emerald-500" />,
    title: 'Operational Analytics',
    description: 'Metrics for checkouts, repairs, and database.',
  },
  {
    href: '/search',
    icon: <Search className="size-8 text-emerald-500" />,
    title: 'Global Search',
    description: 'Look up items by SN, employee, or status.',
  },
  {
    href: '/history',
    icon: <HistoryIcon className="size-8 text-emerald-500" />,
    title: 'Transaction History',
    description: 'View timeline of all checkout and checkin logs.',
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 relative bg-[#0d0c0d] overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#ff1744]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#3178c6]/5 blur-[120px] pointer-events-none" />

      <HomeManagementControls />

      <div className="text-center mt-12 mb-16 relative z-10">
        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight">
          BJ&apos;s <span className="text-[#ff1744]">EquipTrack</span>
        </h1>
        <p className="mt-3 text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
          Enterprise operational lifecycle terminal. Secured with active RBAC auditing.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/overview" className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all">
            <span>View Product Overview & Materials</span> →
          </Link>
        </div>
      </div>

      <div className="w-full max-w-7xl space-y-12 relative z-10">
        {/* Section 1: Operations */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#ff1744]" /> Terminal Operations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {primaryOps.map((item) => (
              <Link href={item.href} key={item.href} className="group">
                <Card className="h-full border-white/5 bg-[#141214]/60 hover:border-[#ff1744]/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="flex flex-col items-start pb-2">
                    <div className="p-3 bg-[#ff1744]/10 rounded-xl mb-3 group-hover:bg-[#ff1744]/15 transition-colors">
                      {item.icon}
                    </div>
                    <CardTitle className="text-lg font-bold text-white">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 2: Management */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#3178c6]" /> Roster & Inventory Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {managementOps.map((item) => (
              <Link href={item.href} key={item.href} className="group">
                <Card className="h-full border-white/5 bg-[#141214]/60 hover:border-[#3178c6]/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="flex flex-col items-start pb-2">
                    <div className="p-3 bg-[#3178c6]/10 rounded-xl mb-3 group-hover:bg-[#3178c6]/15 transition-colors">
                      {item.icon}
                    </div>
                    <CardTitle className="text-lg font-bold text-white">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 3: Analytics & Audits */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Operational Control & Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analyticsOps.map((item) => (
              <Link href={item.href} key={item.href} className="group">
                <Card className="h-full border-white/5 bg-[#141214]/60 hover:border-emerald-500/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="flex flex-col items-start pb-2">
                    <div className="p-3 bg-emerald-500/10 rounded-xl mb-3 group-hover:bg-emerald-500/15 transition-colors">
                      {item.icon}
                    </div>
                    <CardTitle className="text-lg font-bold text-white">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
