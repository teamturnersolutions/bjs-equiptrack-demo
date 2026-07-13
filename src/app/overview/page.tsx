'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Database, ShieldCheck, Terminal, AlertTriangle, Key, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from './overview.module.css';

export default function SOPPage() {
  return (
    <div className="min-h-screen bg-[#090809] text-gray-300 font-sans p-6 md:p-12 relative overflow-hidden">
      <div className={styles.glowTop}></div>
      <div className={styles.glowMiddle}></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12 flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <BookOpen className="size-8 text-[#ff1744]" />
              EquipTrack SOP & Architecture
            </h1>
            <p className="text-gray-400 mt-2">Standard Operating Procedures and Technical Reference</p>
          </div>
          <Button asChild variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="size-4" /> Back to Dashboard
            </Link>
          </Button>
        </header>

        <div className="space-y-16">
          {/* Section 1: Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#ff1744] pl-4">1. Purpose & Overview</h2>
            <div className="bg-[#121113] p-6 rounded-xl border border-white/5">
              <p className="leading-relaxed">
                <strong>EquipTrack</strong> is the central operational visibility platform for warehouse equipment management. It eliminates manual paper workflows, prevents lost inventory, and maintains strict accountability for shared assets (RF Scanners, tablets, radios, etc.).
              </p>
            </div>
          </section>

          {/* Section 2: Architecture */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#ff1744] pl-4">2. Architectural Choices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#121113] p-5 rounded-xl border border-white/5 flex gap-4">
                <Terminal className="size-6 text-[#ff1744] shrink-0" />
                <div>
                  <h3 className="font-bold text-white text-lg">Next.js & React 19</h3>
                  <p className="text-sm mt-1">Utilizes server-rendered routing and Client/Server Actions for instant barcode database mutations. Ensures high speed and robust user interfaces.</p>
                </div>
              </div>
              <div className="bg-[#121113] p-5 rounded-xl border border-white/5 flex gap-4">
                <Database className="size-6 text-[#ff1744] shrink-0" />
                <div>
                  <h3 className="font-bold text-white text-lg">Prisma & PostgreSQL</h3>
                  <p className="text-sm mt-1">Prisma ORM translates code to optimized queries. PostgreSQL handles high concurrency, secure backups, and enterprise scalability.</p>
                </div>
              </div>
              <div className="bg-[#121113] p-5 rounded-xl border border-white/5 flex gap-4">
                <ShieldCheck className="size-6 text-[#ff1744] shrink-0" />
                <div>
                  <h3 className="font-bold text-white text-lg">NextAuth & RBAC</h3>
                  <p className="text-sm mt-1">Provides robust identity management and role-based access control (RBAC), ensuring that only authorized administrators can modify global configurations.</p>
                </div>
              </div>
              <div className="bg-[#121113] p-5 rounded-xl border border-white/5 flex gap-4">
                <Repeat className="size-6 text-[#ff1744] shrink-0" />
                <div>
                  <h3 className="font-bold text-white text-lg">Docker Containerization</h3>
                  <p className="text-sm mt-1">Packaged as a multi-stage Docker container for consistent deployments, zero-overhead setups, and guaranteed offline capability.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Standard Operating Procedures */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#ff1744] pl-4">3. Standard Operating Procedures (SOP)</h2>
            <div className="space-y-6">
              
              <div className="bg-[#121113] p-6 rounded-xl border border-white/5">
                <h3 className="text-xl font-bold text-white mb-3">Checking Out Equipment</h3>
                <ol className="list-decimal list-inside space-y-2 marker:text-[#ff1744] marker:font-bold">
                  <li>Navigate to the <strong>Checkout</strong> page from the main dashboard.</li>
                  <li>Scan or select the Employee Badge / Name from the dropdown.</li>
                  <li>Scan the Barcode(s) of the equipment being assigned.</li>
                  <li>Click <strong>Checkout</strong>. The system will automatically log the timestamp and update the device status.</li>
                </ol>
              </div>

              <div className="bg-[#121113] p-6 rounded-xl border border-white/5">
                <h3 className="text-xl font-bold text-white mb-3">Checking In / Returning Equipment</h3>
                <ol className="list-decimal list-inside space-y-2 marker:text-[#ff1744] marker:font-bold">
                  <li>Navigate to the <strong>Check-In</strong> page.</li>
                  <li>Scan the Barcode(s) of the returning equipment.</li>
                  <li>Click <strong>Check-In</strong>. The equipment is marked as Available and the log is closed.</li>
                </ol>
              </div>

              <div className="bg-[#121113] p-6 rounded-xl border border-white/5">
                <h3 className="text-xl font-bold text-white mb-3">Bulk Administrative Imports</h3>
                <ol className="list-decimal list-inside space-y-2 marker:text-[#ff1744] marker:font-bold">
                  <li>Access the <strong>Admin Workspace</strong> or the Bulk Import Sheet from the top navigation.</li>
                  <li>Paste the raw CSV text containing the new items or employees.</li>
                  <li>The system will parse headers, deduplicate names, and load the records directly into the PostgreSQL database.</li>
                </ol>
              </div>

            </div>
          </section>

          {/* Section 4: Troubleshooting */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#ff1744] pl-4">4. Troubleshooting & Escalation</h2>
            <div className="space-y-4">
              
              <div className="bg-red-500/10 p-5 rounded-xl border border-red-500/20">
                <h4 className="font-bold text-red-400 flex items-center gap-2 mb-2">
                  <AlertTriangle className="size-5" /> Barcode Scanner Not Inputting Data
                </h4>
                <p className="text-sm"><strong>Solution:</strong> EquipTrack expects standard keyboard emulation. Ensure the scanner is configured to append a Carriage Return (Enter) after scanning. Re-pair the bluetooth scanner to the terminal if inputs are lagging.</p>
              </div>

              <div className="bg-red-500/10 p-5 rounded-xl border border-red-500/20">
                <h4 className="font-bold text-red-400 flex items-center gap-2 mb-2">
                  <Repeat className="size-5" /> Incorrect Equipment Assignment
                </h4>
                <p className="text-sm"><strong>Solution:</strong> If an item was assigned to the wrong employee, perform a <strong>Check-In</strong> scan to clear the assignment, then perform a new <strong>Checkout</strong> scan with the correct employee badge.</p>
              </div>

              <div className="bg-red-500/10 p-5 rounded-xl border border-red-500/20">
                <h4 className="font-bold text-red-400 flex items-center gap-2 mb-2">
                  <Key className="size-5" /> Lost Admin Password
                </h4>
                <p className="text-sm"><strong>Solution:</strong> There is no UI to reset the global admin password. You must connect directly to the PostgreSQL container and update the <code>passwordHash</code> field for the <code>admin@equiptrack.com</code> user using a new bcrypt hash. For the Admin Workspace spreadsheet, update the <code>ADMIN_PASSWORD</code> variable in the <code>.env</code> file and restart the container.</p>
              </div>

              <div className="bg-red-500/10 p-5 rounded-xl border border-red-500/20">
                <h4 className="font-bold text-red-400 flex items-center gap-2 mb-2">
                  <Database className="size-5" /> Database Connection Failures
                </h4>
                <p className="text-sm"><strong>Solution:</strong> If the UI shows "Unable to connect to database", verify that the <code>equiptrack-db</code> PostgreSQL container is running via <code>docker ps</code>. Check that the <code>DATABASE_URL</code> in your environment file exactly matches the credentials of the running database container.</p>
              </div>

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
