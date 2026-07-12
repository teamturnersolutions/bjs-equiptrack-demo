'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type InventoryItem } from '@/lib/types';
import { User, Clock, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditItemSheet } from '@/app/_components/edit-item-sheet';

function formatDate(dateString?: string) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function InventoryCard({ item }: { item: InventoryItem }) {
  const [open, setOpen] = useState(false);
  const lastActivityDate = item.status === 'Checked Out' ? item.checkedOutDate : item.checkedInDate;
  const lastActivityLabel = item.status === 'Checked Out' ? 'Checked Out' : 'Last Check-In';

  return (
    <>
      <Card className="flex flex-col h-full relative group">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1.5">
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <CardDescription>
              <Badge variant={item.status === 'Available' ? 'secondary' : 'destructive'}>
                {item.status}
              </Badge>
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setOpen(true)}
            title="Edit Item"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-grow space-y-3 pt-2">
          {item.status === 'Checked Out' && item.checkedOutBy && (
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="mr-2 h-4 w-4" />
              <span>Assigned to: {item.checkedOutBy}</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>{lastActivityLabel}: {formatDate(lastActivityDate)}</span>
          </div>
        </CardFooter>
      </Card>
      
      <EditItemSheet item={item} open={open} onOpenChange={setOpen} />
    </>
  );
}

