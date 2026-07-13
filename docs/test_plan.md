# WorkspaceONE UEM & QA Test Plan

This document outlines the mandatory QA test scripts that must be executed on a target device managed by WorkspaceONE UEM prior to a full enterprise rollout.

## 1. Web Clip / App Launch Test
**Goal**: Verify that the PWA Web Clip configures the UI correctly and respects UEM boundaries.
- [ ] Ensure the EquipTrack Web Clip appears on the device home screen with the correct icon.
- [ ] Tap the icon and verify the application launches without the Safari/Chrome URL bar (Standalone Mode).
- [ ] Validate that external links (if any) do not break the PWA sandbox unless intended.

## 2. Authentication & Authorization
**Goal**: Verify role-based access control and session management.
- [ ] Attempt to access an admin route (e.g., `/api/admin/...`) using a standard user credential. Verify it returns `403 Forbidden`.
- [ ] Let the device sit idle and confirm the NextAuth session expires properly according to policy, requiring re-authentication.

## 3. Hardware Peripheral Integration (Barcode Scanning)
**Goal**: Validate physical or Bluetooth scanners work correctly with Next.js forms.
- [ ] **Rapid Scan Test**: Scan an employee badge followed immediately by 5 asset barcodes. Verify no characters are dropped.
- [ ] **Carriage Return Test**: Ensure the scanner automatically submits the scanned code (appends `\n` or `ENTER` keypress).
- [ ] **Check In Test**: Perform a Check In scan on multiple assets and verify the dashboard updates instantly.

## 4. Concurrency & Reliability
**Goal**: Verify PostgreSQL transaction locks work during high concurrency.
- [ ] Have two different devices attempt to check out the **same** equipment asset simultaneously.
- [ ] Verify that one device succeeds, and the other receives a graceful "Item already checked out" error message.

## 5. Network Conditions
**Goal**: Assess performance in challenging warehouse environments.
- [ ] Throttle the device's network to simulated 3G speeds.
- [ ] Verify that the Next.js UI does not completely lock up and loading states (spinners) appear properly during checkout operations.
