import Link from 'next/link';
import {
  Card,
  CardContent,
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
  BarChart3,
  Search,
  BookOpen
} from 'lucide-react';
import { HomeManagementControls } from './_components/home-management-controls';

const primaryOps = [
  {
    href: '/checkout',
    icon: <PackageSearch className="size-6 text-[#ff1744]" />,
    title: 'Check Out',
    description: 'Assign hardware to team members.',
  },
  {
    href: '/checkin',
    icon: <PackageCheck className="size-6 text-[#ff1744]" />,
    title: 'Check In',
    description: 'Return hardware to inventory.',
  },
  {
    href: '/repairs',
    icon: <Wrench className="size-6 text-[#ff1744]" />,
    title: 'Repairs & Tag Out',
    description: 'Manage damaged devices.',
  },
];

const managementOps = [
  {
    href: '/inventory',
    icon: <LayoutGrid className="size-6 text-[#3178c6]" />,
    title: 'Inventory',
    description: 'Browse all items and statuses.',
  },
  {
    href: '/members',
    icon: <Users className="size-6 text-[#3178c6]" />,
    title: 'Team Members',
    description: 'Manage the team roster.',
  },
];

const analyticsOps = [
  {
    href: '/dashboard',
    icon: <BarChart3 className="size-6 text-emerald-500" />,
    title: 'Analytics',
    description: 'Metrics and utilization.',
  },
  {
    href: '/search',
    icon: <Search className="size-6 text-emerald-500" />,
    title: 'Global Search',
    description: 'Look up items or employees.',
  },
  {
    href: '/history',
    icon: <HistoryIcon className="size-6 text-emerald-500" />,
    title: 'History',
    description: 'View checkout and checkin logs.',
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-4 sm:p-8 bg-[#090809]">
      <HomeManagementControls />
      
      <div className="w-full max-w-6xl mx-auto space-y-8 mt-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              BJ&apos;s <span className="text-[#ff1744]">EquipTrack</span>
              <span className="text-emerald-500 font-semibold text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">PROD</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">Operational Lifecycle Terminal</p>
          </div>
          <Link href="/overview" className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all">
            <BookOpen className="size-4" /> View Documentation
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Operations Column */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-400 tracking-wider uppercase flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#ff1744]" /> Terminal Operations
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {primaryOps.map((item) => (
                <Link href={item.href} key={item.href} className="group block">
                  <Card className="border-white/5 bg-[#121113] hover:border-[#ff1744]/40 hover:bg-white/5 transition-all">
                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                      <div className="p-2.5 bg-[#ff1744]/10 rounded-lg group-hover:bg-[#ff1744]/20 transition-colors">
                        {item.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-white">{item.title}</CardTitle>
                        <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Management Column */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-400 tracking-wider uppercase flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#3178c6]" /> Data Management
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {managementOps.map((item) => (
                <Link href={item.href} key={item.href} className="group block">
                  <Card className="border-white/5 bg-[#121113] hover:border-[#3178c6]/40 hover:bg-white/5 transition-all">
                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                      <div className="p-2.5 bg-[#3178c6]/10 rounded-lg group-hover:bg-[#3178c6]/20 transition-colors">
                        {item.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-white">{item.title}</CardTitle>
                        <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Analytics Column */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-400 tracking-wider uppercase flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Insight & Auditing
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {analyticsOps.map((item) => (
                <Link href={item.href} key={item.href} className="group block">
                  <Card className="border-white/5 bg-[#121113] hover:border-emerald-500/40 hover:bg-white/5 transition-all">
                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                      <div className="p-2.5 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                        {item.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-white">{item.title}</CardTitle>
                        <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
