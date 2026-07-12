'use client';

import dynamic from 'next/dynamic';

const WorkspaceClient = dynamic(
  () => import('./workspace-client'),
  { ssr: false }
);

export default function WorkspaceWrapper() {
  return <WorkspaceClient />;
}
