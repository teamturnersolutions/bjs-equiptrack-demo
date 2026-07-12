'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Univer, UniverInstanceType } from "@univerjs/core";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverUIPlugin } from "@univerjs/ui";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";

import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";

type InventoryItem = {
  id: number;
  name: string;
  assetNumber?: string | null;
  serialNumber?: string | null;
  status: string;
};

export default function WorkspaceClient() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const univerRef = useRef<Univer | null>(null);
  const workbookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Fetch inventory data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
      } else {
        toast({ title: 'Error', description: 'Failed to load inventory.', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Error connecting to server.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (loading || items.length === 0 || !containerRef.current) return;

    // Clean up previous instance
    if (univerRef.current) {
      univerRef.current.dispose();
    }

    try {
      const univer = new Univer();

      univer.registerPlugin(UniverRenderEnginePlugin);
      univer.registerPlugin(UniverFormulaEnginePlugin);
      univer.registerPlugin(UniverUIPlugin, {
        container: containerRef.current,
        header: true,
        footer: true,
      });
      univer.registerPlugin(UniverSheetsPlugin);
      univer.registerPlugin(UniverSheetsUIPlugin);

      // Build cell data
      const cellData: Record<number, Record<number, { v: string }>> = {
        0: {
          0: { v: "Item ID" },
          1: { v: "Equipment Name" },
          2: { v: "Asset Number" },
          3: { v: "Serial Number" },
          4: { v: "Current Status" },
        }
      };

      // Populate cells
      items.forEach((item, index) => {
        const row = index + 1;
        cellData[row] = {
          0: { v: item.id.toString() },
          1: { v: item.name },
          2: { v: item.assetNumber || "" },
          3: { v: item.serialNumber || "" },
          4: { v: item.status },
        };
      });

      const workbook = univer.createUnit(UniverInstanceType.UNIVER_SHEET, {
        id: "workbook-inventory",
        sheetOrder: ["sheet-inventory"],
        sheets: {
          "sheet-inventory": {
            id: "sheet-inventory",
            name: "EquipTrack Inventory",
            rowCount: items.length + 10,
            columnCount: 5,
            cellData,
          }
        }
      });

      univerRef.current = univer;
      workbookRef.current = workbook;
    } catch (err) {
      console.error("Univer failed to initialize:", err);
    }

    return () => {
      if (univerRef.current) {
        univerRef.current.dispose();
        univerRef.current = null;
      }
    };
  }, [loading, items]);

  const handleSave = async () => {
    const workbook = workbookRef.current;
    if (!workbook) return;
    setSaving(true);

    try {
      const activeSheet = workbook.getActiveSheet();
      if (!activeSheet) {
        throw new Error("No active sheet found.");
      }

      const snapshot = activeSheet.getSnapshot();
      const rows = snapshot.cellData;

      const updatedItems: any[] = [];
      const rowCount = Object.keys(rows).length;

      // Parse spreadsheet rows back into JSON items
      for (let i = 1; i < rowCount; i++) {
        const row = rows[i];
        if (!row) continue;

        const idVal = row[0]?.v;
        const nameVal = row[1]?.v;
        const assetVal = row[2]?.v;
        const serialVal = row[3]?.v;
        const statusVal = row[4]?.v;

        if (idVal) {
          updatedItems.push({
            id: parseInt(idVal),
            name: nameVal || "",
            assetNumber: assetVal || null,
            serialNumber: serialVal || null,
            status: statusVal || "Available",
          });
        }
      }

      const response = await fetch('/api/admin/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems }),
      });

      const result = await response.json();
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        router.refresh();
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to save changes.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">Administrative Spreadsheet</h1>
            <p className="text-xs text-muted-foreground">Excel-like bulk data manager powered by Univer core.</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading || saving}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Reload
          </Button>
          <Button size="sm" onClick={handleSave} disabled={loading || saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            Save Spreadsheet
          </Button>
        </div>
      </div>

      <Card className="border-white/5 bg-[#141214]/60">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle>Bulk Edit Inventory</CardTitle>
          <CardDescription>
            Modify cell values directly. Press Enter or tab out to commit edits in the cell before saving. IDs are read-only.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Initializing Univer core engines...</p>
            </div>
          ) : (
            <div 
              ref={containerRef} 
              id="univer-container" 
              className="w-full h-[600px] rounded-b-lg overflow-hidden border-t border-white/5" 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
