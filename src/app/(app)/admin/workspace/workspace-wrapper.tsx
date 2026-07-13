'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const WorkspaceClient = dynamic(
  () => import('./workspace-client'),
  { ssr: false }
);

export default function WorkspaceWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div key="wrapper-loader" className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading workspace...</p>
      </div>
    );
  }

  return <WorkspaceClient key="workspace-client-loaded" />;
}
