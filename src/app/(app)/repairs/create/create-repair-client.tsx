'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/app-header';
import { createRepairTicket } from '@/app/actions';
import { Loader2, ShieldAlert } from 'lucide-react';

type Item = {
  id: number;
  name: string;
  assetNumber: string | null;
  serialNumber: string | null;
};

export function CreateRepairClient({ items }: { items: Item[] }) {
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [category, setCategory] = useState<string>('Physical Damage');
  const [severity, setSeverity] = useState<string>('Medium');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || !description.trim()) {
      toast({ title: 'Validation Error', description: 'Please select an item and provide a description.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const res = await createRepairTicket(
        parseInt(selectedItemId),
        category as any,
        severity as any,
        description
      );

      if (res.success) {
        toast({ title: 'Success', description: res.message });
        router.push('/repairs');
        router.refresh();
      } else {
        toast({ title: 'Error', description: res.message, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'An error occurred during submission.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <AppHeader title="Tag Out Device" />

      <Card className="border-white/5 bg-[#141214]/60">
        <CardHeader>
          <CardTitle className="text-white font-bold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[#ff1744]" /> File Repair Ticket
          </CardTitle>
          <CardDescription className="text-gray-400">
            Select a device and file a diagnostics report. The device will be tagged out and locked from checkouts.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item">Select Equipment</Label>
              <Select value={selectedItemId} onValueChange={setSelectedItemId} required>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Choose a hardware asset..." />
                </SelectTrigger>
                <SelectContent className="bg-[#141214] text-white border-white/5">
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name} {item.serialNumber ? `(SN: ${item.serialNumber})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Issue Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141214] text-white border-white/5">
                    {["Physical Damage", "Screen", "Battery", "Scanner", "Keyboard", "Charging", "Software", "Network", "Missing Parts", "Other"].map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity Level</Label>
                <Select value={severity} onValueChange={setSeverity} required>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141214] text-white border-white/5">
                    {["Low", "Medium", "High", "Critical"].map((sev) => (
                      <SelectItem key={sev} value={sev}>{sev}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Problem Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what is wrong with the device (e.g. cracked screen, scanner beam won't fire)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/5 border-white/10 text-white min-h-[120px]"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push('/repairs')}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:opacity-90">
              {loading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : null} File Tag Out
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
