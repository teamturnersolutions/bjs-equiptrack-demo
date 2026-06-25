<div align="center">

<img src="BJs-Logo/BJs-logo.png" alt="BJ's Wholesale Club" width="120" />

# BJ's EquipTrack

### Intelligent Equipment & Inventory Management

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](#-getting-started)
[![Architecture](https://img.shields.io/badge/Architecture-AMD64%20%7C%20ARM64-blue?logo=docker&logoColor=white)](#-deployment-philosophy)
[![Next.js](https://img.shields.io/badge/Next.js_15-black?logo=next.js&logoColor=white)](#-architecture-overview)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](#-architecture-overview)
[![Status](https://img.shields.io/badge/Status-Production_Ready-brightgreen)](#)

**A streamlined, lightweight platform for tracking equipment and inventory across operational environments.**

</div>

---

## 🌐 Live Demo

<div align="center">

### **[▶️ Launch EquipTrack Demo](https://equiptrack.teamturnersolutions.com)**

[![Live Demo](https://img.shields.io/badge/Live_Demo-equiptrack.teamturnersolutions.com-FF1744?style=for-the-badge&logo=google-cloud&logoColor=white)](https://equiptrack.teamturnersolutions.com)

*Hosted on Google Cloud Run — explore the full application with pre-loaded sample data.*
### If you Receive a Bad Gateway Notification, refresh your browser. The load balancer is set to 0 to keep costs at a minimum, so that the instance is not always running.

</div>

---

## 📋 Executive Summary

**EquipTrack** is more than a simple inventory application. It is an **Operational Visibility Platform** designed to manage equipment, assignments, locations, inventory records, and future operational workflows through a modern, lightweight architecture. 

In busy warehouse clubs, distribution centers, and maintenance environments, operational efficiency depends heavily on the availability and traceability of shared equipment (e.g., RF units, hand grinders, specialized tools). EquipTrack eliminates the operational friction of paper logs, reduces replacement costs due to lost or unaccounted-for assets, and provides management teams with real-time insight into what equipment is currently in the field, who is using it, and when it is expected back.

By packaging robust enterprise-grade practices into an accessible, low-overhead solution, EquipTrack enables companies to digitize their inventory workflows instantly without the complexity or high maintenance costs of traditional asset management suites.

---

## 🏗️ Architecture Overview

EquipTrack uses a modern, lightweight, full-stack monolithic architecture designed for fast response times and zero-overhead deployments.

### System Data Flow

<div align="center">

![System Data Flow](systemDataFlow.jpeg)

</div>

### Architectural Layer Responsibilities
1. **User / Operator:** The browser interface, optimized for mobile phones, rugged warehouse scanners, and desktop terminals. It handles client-side input like barcode scanner inputs.
2. **Next.js:** The framework driving the application. It serves pre-rendered pages via React Server Components (RSCs) for high speed, manages layouts, and coordinates routing between pages.
3. **Application Logic:** The core business rules of the platform (implemented as Next.js Server Actions). It validates that items are available before a checkout, coordinates multi-item transactions, and formats audit logs.
4. **Prisma ORM:** The data access layer. It translates TypeScript code into optimized database queries, ensuring type safety and handling automated schema migrations.
5. **SQLite:** The physical database engine. It runs in-process as a lightweight, zero-configuration file, offering high speed and simple backups without the overhead of external database servers.

---

## 💡 Technology Explained for Everyone

For non-technical stakeholders, software terms can feel like a foreign language. Here is how the EquipTrack system works, explained using familiar warehouse and office analogies:

| Technical Concept | Everyday Analogy | What it Actually Does in EquipTrack |
| :--- | :--- | :--- |
| **Next.js** | **The Building Manager** | Manages the overall app structure, hosts the pages, and directs traffic to ensure users get what they need quickly. |
| **Routing** | **Hallways & Room Numbers** | The paths in the web address (like `/checkout` or `/history`) that guide users to specific rooms or screens. |
| **React Server Components** | **Office Staff Preparing Your Packet** | Behind-the-scenes staff who pre-assemble all requested data on the server before sending the completed page to your screen. |
| **Server Actions** | **Submitting a Request Form** | A secure window where you submit a form (like checking out a device) to be processed directly by the back office. |
| **Application Logic** | **Company Policies** | The rules of the business, such as "An employee cannot check out an RF scanner if someone else is currently holding it." |
| **Prisma ORM** | **The Translator** | An interpreter who translates requests from the office staff into the language that the records storage clerk understands. |
| **Database Models** | **Filing Cabinet Labels** | The designated labels on drawer fronts (e.g., "Employees", "Equipment") that define what goes where. |
| **Queries** | **The Filing Clerk** | The act of going into the records room to pull out specific files (e.g., "Get me the history of checked-out iPads"). |
| **Migrations** | **Renovating the Filing System** | Reorganizing the files or adding new drawers to the cabinets without losing or scrambling any of the existing papers. |
| **SQLite** | **The Filing Cabinet** | The physical cabinet where all files, records, and logs are organized and stored in one unit. |
| **Tailwind CSS** | **Interior Design** | The paint, font choices, buttons, and visual styling that make the application clean, modern, and pleasant to use. |
| **Docker** | **The Shipping Container** | A standard container holding the office, furniture, and records cabinet. It allows you to ship the entire application and run it anywhere instantly. |
| **SQLite Database File** | **The Records Room** | The specific secure room inside the shipping container where the filing cabinet resides, keeping all database records safe. |

<div align="center">

![EquipTrack Technology Analogy](non-technicalBreakdown.jpeg)

</div>

---

## 👔 Administrative Portal

To support daily business operations, EquipTrack includes a dedicated **Administrative Portal**. This panel is designed for managers, team leads, and IT administrators who oversee inventory health.

### Accessing the Portal
Authorized personnel can access the Administrative Portal by appending `/admin` to the application's base URL:
* **Local Environment:** [http://localhost:9002/admin](http://localhost:9002/admin)
* **Production / Demo Environment:** [https://equiptrack.teamturnersolutions.com/admin](https://equiptrack.teamturnersolutions.com/admin)

### Core Administrative Functions
* **Data Correction:** Edit incorrect entries, clean up user profiles, and adjust timestamp records when employees forget to check items in.
* **Equipment Management:** Add new assets, update names, write off lost units, or update status indicators.
* **Employee Management:** Administer the roster of authorized team members and manage department profiles.
* **Assignment Administration:** Overwrite current assignments and manually return items to stock.
* **Operational Maintenance:** Run diagnostic checks and manage bulk imports of data.

> [!NOTE]
> To enable rapid local onboarding and testing, the initial administrative functions do not require login credentials. Planned updates will introduce authentication, role-based access control (RBAC), and immutable audit logs for administrative actions.

---

## 📦 Deployment Philosophy

EquipTrack is designed around the concept of an **"Application in a Box."** We leverage **Docker containerization** to pack the entire application, database structure, and dependencies into a single deployment unit.

### Why We Choose Docker
* **Consistent Deployments:** Eliminates the "it works on my machine" problem. The application runs in the exact same environment during local development as it does in cloud production.
* **Self-Contained Environment:** You do not need to install Node.js, database drivers, or web servers on the host system. Docker handles it all internally.
* **Rapid Onboarding:** Spin up a fully functional production instance with a single terminal command in under two minutes.
* **Cross-Platform Support:** The container image is built natively for both standard Intel/AMD servers (`AMD64`) and Apple Silicon or Graviton servers (`ARM64`), guaranteeing zero-emulation overhead.

---

## 🚀 Getting Started

Launch the platform locally or in your cloud environment with either of these zero-configuration methods.

### Option 1: Run with Docker (Recommended)

```bash
docker run -d \
  --name equiptrack \
  -p 9002:9002 \
  -v equiptrack_data:/app/prisma \
  -e DATABASE_URL="file:/app/prisma/dev.db" \
  -e NODE_ENV=production \
  -e TZ=America/New_York \
  --restart unless-stopped \
  teamturnersolutions/equiptrack:demo
```

### Option 2: Run with Docker Compose

1. Clone the repository and navigate to the directory:
   ```bash
   git clone https://github.com/teamturnersolutions/bjs-equiptrack-demo.git
   cd bjs-equiptrack-demo
   ```
2. Launch the services:
   ```bash
   docker compose up -d
   ```

### Accessing the Interface
Once the container is running, open your web browser and navigate to:
🌐 **[http://localhost:9002](http://localhost:9002)**

> [!TIP]
> The demo container is **pre-populated with sample items and team members** so you can test checking out, scanning, and viewing historical logs immediately.

---

## 🎯 Vision

EquipTrack is built to scale alongside operational needs. Our development roadmap bridges current execution needs with upcoming smart workflows.

### Current Capabilities
* **Equipment Management:** Define, catalog, and track operational items with real-time availability statuses.
* **Employee Assignments:** Pair equipment directly with team members to create clear checkout records and establish user accountability.
* **Location Tracking:** Monitor which zones, departments, or shifts are utilizing specific assets.
* **Administrative Operations:** Edit transaction histories, correct records, and manage lists of items and team members via a dedicated admin interface.
* **Reporting:** Instantly export historical logs to standard CSV formats for compliance audits and performance reporting.

### Future Vision & AI-Assisted Workflows
As the platform evolves, it will integrate advanced AI capabilities to streamline warehouse floor operations and eliminate manual terminal interactions.

* **Phase 1: Intelligent Assistant (Conversational Querying)**
  Initial integration focuses on an intelligent natural language assistant that allows users to query database states conversationally. 
  
  *Examples:*
  * *"Show me all assigned forklifts."*
  * *"Who has asset RF# 55"*
  * *"What equipment is due for inspection?"*

* **Phase 2: AI Agent (Voice-Activated Task Execution)**
  The long-term roadmap features a high-performance **AI Agent** capable of executing tasks directly on behalf of the operator. By leveraging voice recognition and a structured command format (`[Wake Word] + [Equipment] + [User]`), operators can perform hands-free, high-speed transactions. This voice-driven agentic execution will speed up the check-in and check-out processes exponentially, allowing workers to process equipment on the move without stopping to manually interact with a touchscreen or keyboard.

<div align="center">

![EquipTrack AI Vision](futureVision.jpeg)

</div>

Beyond AI integrations, the future vision includes proactive **Preventative Maintenance Tracking**, automated **Asset Lifecycle Management** (tracking cumulative operational hours and wear metrics), and **Workflow Automation** (auto-alerting supervisors when stock levels drop).

---

## 🗺️ Roadmap

The roadmap guides EquipTrack from its current lightweight state to an enterprise-grade operational hub.

| Current Capabilities (In Production) | Planned Enhancements (Development Pipeline) |
| :--- | :--- |
| **Equipment Tracking** (Live status updates) | **Role-Based Access Control** (Secure logins & permissions) |
| **Assignments** (Mapping equipment to members) | **Audit Logging** (Immutable records of administrative edits) |
| **Administrative Portal** (Manual status corrections) | **Advanced Reporting** (Usage trends & utilization charts) |
| **SQLite Persistence** (Zero-configuration file DB) | **PostgreSQL Support** (For high-concurrency enterprise deployments) |
| **Docker Deployment** (Native AMD64 & ARM64 builds) | **Mobile Enhancements** (Native scanner integrations & offline sync) |
| **Bulk Data Import** (Import members/items via CSV) | **AI Assistant Integration** (Natural language query interface) |
| | **Preventative Maintenance** (Inspections & lifecycle tracking) |

---

<div align="center">

**Developed by [Team Turner Solutions](https://github.com/teamturnersolutions)**

*For support, feature requests, or deployment assistance, contact the development team.*

</div>
