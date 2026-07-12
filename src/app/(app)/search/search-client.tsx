'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Package, Users, Wrench, ShieldAlert } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export function SearchClient() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ items: any[]; members: any[]; repairs: any[] }>({
    items: [],
    members: [],
    repairs: [],
  });
  const [searching, setSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim() === '') return;

    setSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setResults({
          items: data.items || [],
          members: data.members || [],
          repairs: data.repairs || [],
        });
      } else {
        toast({ title: 'Error', description: data.message || 'Failed to search database.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Network error executing search.', variant: 'destructive' });
    } finally {
      setSearching(false);
    }
  };

  // Debounced search trigger as the user types
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim() !== '') {
        handleSearch();
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="space-y-6">
      <AppHeader title="Global Search" />

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment names, asset numbers, serials, team members..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 py-6 bg-white/5 border-white/10 text-white focus-visible:ring-primary"
          />
        </div>
        <Button type="submit" size="lg" className="bg-primary hover:opacity-90">
          {searching ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
        </Button>
      </form>

      {query.trim() !== '' && !searching && (
        <div className="space-y-8">
          {/* Section 1: Equipment */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-[#ff1744]" /> Equipment Matches ({results.items.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.items.length > 0 ? (
                results.items.map((item) => (
                  <Card key={item.id} className="border-white/5 bg-[#141214]/60">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-md text-white font-bold">{item.name}</CardTitle>
                        <Badge variant={item.status === 'Available' ? 'secondary' : 'destructive'}>{item.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="text-xs text-gray-400 space-y-1">
                      <div>Asset Number: <span className="text-gray-200 font-mono">{item.assetNumber || 'N/A'}</span></div>
                      <div>Serial Number: <span className="text-gray-200 font-mono">{item.serialNumber || 'N/A'}</span></div>
                      {item.checkedOutBy && <div>Assigned To: <span className="text-primary font-medium">{item.checkedOutBy}</span></div>}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">No matching equipment found.</p>
              )}
            </div>
          </div>

          {/* Section 2: Team Members */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-[#3178c6]" /> Team Member Matches ({results.members.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.members.length > 0 ? (
                results.members.map((member) => (
                  <Card key={member.id} className="border-white/5 bg-[#141214]/60">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md text-white font-bold">{member.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-gray-400">
                      <div>Department: <span className="text-gray-200">{member.department || 'Operations'}</span></div>
                      <div>Roster ID: <span className="text-gray-200 font-mono">{member.id}</span></div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">No matching team members found.</p>
              )}
            </div>
          </div>

          {/* Section 3: Repairs */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="h-5 w-5 text-emerald-500" /> Active Repairs Matches ({results.repairs.length})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {results.repairs.length > 0 ? (
                results.repairs.map((repair) => (
                  <Card key={repair.id} className="border-white/5 bg-[#141214]/60">
                    <CardHeader className="pb-2 flex flex-row justify-between items-start">
                      <div>
                        <CardTitle className="text-md text-white font-bold">Ticket #{repair.id}: {repair.item?.name || 'Unknown Item'}</CardTitle>
                        <CardDescription className="text-xs text-gray-400 mt-0.5">Category: {repair.category} | Severity: {repair.severity}</CardDescription>
                      </div>
                      <Badge variant={repair.status === 'Returned to Service' ? 'secondary' : 'destructive'}>{repair.status}</Badge>
                    </CardHeader>
                    <CardContent className="text-xs text-gray-300">
                      <p className="bg-white/5 p-2 rounded border border-white/5">{repair.description}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">No matching repair tickets found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
