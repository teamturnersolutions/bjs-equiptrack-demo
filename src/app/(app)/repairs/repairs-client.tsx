'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Wrench, ShieldAlert, FileText, CheckCircle2, User, Clock, Loader2, Plus, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/app-header';
import { resolveRepairTicket } from '@/app/actions';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

type RepairRecord = {
  id: number;
  itemId: number;
  item: {
    name: string;
    assetNumber: string | null;
    serialNumber: string | null;
  };
  reporter: {
    displayName: string | null;
    email: string;
  } | null;
  createdAt: Date;
  category: string;
  severity: string;
  status: string;
  description: string;
  resolution: string | null;
  resolutionDate: Date | null;
};

export function RepairsClient({ tickets }: { tickets: any[] }) {
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [resolution, setResolution] = useState('');
  const [resolving, setResolving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleResolveClick = (ticket: any) => {
    setSelectedTicket(ticket);
    setResolution('');
    setDialogOpen(true);
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !resolution.trim()) return;

    setResolving(true);
    try {
      const result = await resolveRepairTicket(selectedTicket.id, resolution);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        setDialogOpen(false);
        router.refresh();
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to resolve ticket.', variant: 'destructive' });
    } finally {
      setResolving(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    // Status filter
    if (filter === 'open' && t.status === 'Returned to Service') return false;
    if (filter === 'resolved' && t.status !== 'Returned to Service') return false;

    // Search filter
    if (search.trim() !== '') {
      const term = search.toLowerCase();
      return (
        t.item.name.toLowerCase().includes(term) ||
        (t.item.serialNumber && t.item.serialNumber.toLowerCase().includes(term)) ||
        t.description.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term)
      );
    }

    return true;
  });

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'Critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'High': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Medium': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Returned to Service') {
      return <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">Resolved</Badge>;
    }
    return <Badge variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20">Tagged Out</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AppHeader title="Repairs & Tag Out" />
        <Button asChild className="bg-primary hover:opacity-90">
          <Link href="/repairs/create">
            <Plus className="h-4 w-4 mr-1.5" /> Tag Out Device
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#141214]/40 p-4 rounded-xl border border-white/5">
        <div className="flex gap-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>All</Button>
          <Button variant={filter === 'open' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('open')}>Active Tagged Out</Button>
          <Button variant={filter === 'resolved' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('resolved')}>Resolved</Button>
        </div>
        <Input
          placeholder="Filter tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs bg-white/5 border-white/10"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="border-white/5 bg-[#141214]/60">
              <CardHeader className="flex flex-row justify-between items-start pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg text-white font-bold">{ticket.item.name}</CardTitle>
                    {getStatusBadge(ticket.status)}
                    <Badge variant="outline" className={getSeverityColor(ticket.severity)}>{ticket.severity}</Badge>
                  </div>
                  <CardDescription className="text-gray-400 mt-1">
                    Category: {ticket.category} | SN: {ticket.item.serialNumber || 'N/A'}
                  </CardDescription>
                </div>
                {ticket.status !== 'Returned to Service' && (
                  <Button size="sm" variant="outline" onClick={() => handleResolveClick(ticket)}>
                    Resolve Ticket <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-3 pt-2 text-sm text-gray-300">
                <p className="bg-white/5 p-3 rounded-lg border border-white/5">{ticket.description}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
                  <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1" /> Reported: {new Date(ticket.createdAt).toLocaleString()}</span>
                  <span className="flex items-center"><User className="h-3.5 w-3.5 mr-1" /> Filed by: {ticket.reporter?.displayName || 'System / Admin'}</span>
                </div>
                {ticket.status === 'Returned to Service' && ticket.resolution && (
                  <div className="mt-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                    <p className="text-emerald-400 font-semibold text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Resolution Details (Closed {new Date(ticket.resolutionDate!).toLocaleString()})
                    </p>
                    <p className="text-gray-400 text-xs mt-1">{ticket.resolution}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-16 bg-[#141214]/20 rounded-xl border border-dashed border-white/5">
            <p className="text-muted-foreground">No repair records found matching the criteria.</p>
          </div>
        )}
      </div>

      {/* Resolution Sheet */}
      <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
        <SheetContent className="border-white/5 bg-[#141214] text-white">
          <SheetHeader>
            <SheetTitle>Resolve Repair Ticket</SheetTitle>
            <SheetDescription className="text-gray-400">
              Provide details of the repair or diagnostics performed before returning the equipment to service.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleResolveSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution Summary</Label>
                <Textarea
                  id="resolution"
                  placeholder="Describe repair actions (e.g., replaced charging port, rebooted OS)..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
            </div>
            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={resolving} className="bg-primary hover:opacity-90">
                {resolving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null} Complete Repair
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
