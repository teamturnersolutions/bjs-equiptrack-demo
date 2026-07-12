const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const PERMISSIONS = [
  "equipment.read",
  "equipment.create",
  "equipment.update",
  "equipment.delete",
  "employee.read",
  "employee.update",
  "repair.read",
  "repair.create",
  "repair.update",
  "repair.close",
  "reports.view",
  "admin.users.manage",
  "admin.roles.manage",
  "system.settings.manage",
];

const ROLE_PERMISSIONS = {
  Administrator: PERMISSIONS,
  Supervisor: [
    "equipment.read",
    "equipment.create",
    "equipment.update",
    "employee.read",
    "employee.update",
    "repair.read",
    "repair.create",
    "repair.update",
    "repair.close",
    "reports.view",
  ],
  Operator: [
    "equipment.read",
    "employee.read",
    "repair.read",
    "repair.create",
    "repair.update",
  ],
  Viewer: [
    "equipment.read",
    "repair.read",
    "reports.view",
  ],
};

function parseCsv(csvData) {
  const lines = csvData.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    const entry = {};
    headers.forEach((header, index) => {
      const value = values[index];
      entry[header] = value === '' || value === undefined ? null : value;
    });
    return entry;
  });
}

async function main() {
  console.log("--- Starting Database Seeding ---");

  // 1. Seed Permissions
  console.log("Seeding permissions...");
  const dbPermissions = {};
  for (const name of PERMISSIONS) {
    const perm = await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    dbPermissions[name] = perm.id;
  }

  // 2. Seed Roles and map Permissions
  console.log("Seeding roles and mapping permissions...");
  const dbRoles = {};
  for (const [roleName, permissionNames] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
    dbRoles[roleName] = role.id;

    // Link permissions to role
    for (const name of permissionNames) {
      const permissionId = dbPermissions[name];
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId,
        },
      });
    }
  }

  // 3. Seed Default Admin User
  console.log("Seeding default admin user...");
  const adminEmail = "admin@equiptrack.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = "$2b$10$J7kUTrYNXGZeecCc6UzWXOv8U98te87wWHU0ncvVHB5P6HvusKwm6";
    await prisma.user.create({
      data: {
        email: adminEmail,
        displayName: "System Administrator",
        passwordHash,
        provider: "credentials",
        roleId: dbRoles["Administrator"],
        active: true,
        department: "IT Operations",
        facility: "HQ Warehouse",
        employeeNumber: "EMP-0001",
      },
    });
    console.log("Created default admin user: admin@equiptrack.com / adminpassword");
  } else {
    console.log("Admin user already exists.");
  }

  // 4. Seed Locations
  console.log("Seeding default locations...");
  const locationsData = [
    { building: "Building A", department: "Receiving", storageArea: "Aisle 3 Shelf B" },
    { building: "Building A", department: "Shipping", storageArea: "Dock door 4" },
    { building: "Building B", department: "Maintenance", storageArea: "Tool Room" },
  ];

  const dbLocations = [];
  for (const loc of locationsData) {
    const created = await prisma.location.create({
      data: loc,
    });
    dbLocations.push(created);
  }

  // 5. Seed Roster and Inventory from CSVs if empty
  const membersCount = await prisma.teamMember.count();
  if (membersCount === 0) {
    console.log("Seeding team members from CSV...");
    const teamMembersPath = path.join(process.cwd(), 'team-members.csv');
    const memberIdMap = new Map();
    if (fs.existsSync(teamMembersPath)) {
      const data = fs.readFileSync(teamMembersPath, 'utf-8');
      const members = parseCsv(data);
      for (const m of members) {
        if (!m.name) continue;
        const created = await prisma.teamMember.create({
          data: { name: m.name, department: "Operations", status: "Active" }
        });
        if (m.id) {
          memberIdMap.set(m.id, created.id);
        }
      }
    }

    console.log("Seeding inventory items from CSV...");
    const inventoryPath = path.join(process.cwd(), 'inventory.csv');
    if (fs.existsSync(inventoryPath)) {
      const data = fs.readFileSync(inventoryPath, 'utf-8');
      const items = parseCsv(data);
      for (const i of items) {
        if (!i.name) continue;
        const newMemberId = i.checkedOutById ? memberIdMap.get(i.checkedOutById) : null;
        
        // Randomly assign a location for demonstration
        const randomLoc = dbLocations[Math.floor(Math.random() * dbLocations.length)];

        await prisma.inventoryItem.create({
          data: {
            name: i.name,
            status: i.status === "Checked Out" ? "Assigned" : "Available",
            checkedOutBy: i.checkedOutBy,
            checkedOutById: newMemberId,
            checkedOutDate: i.checkedOutDate,
            checkedInDate: i.checkedInDate,
            assetNumber: `AST-${Math.floor(100000 + Math.random() * 900000)}`,
            serialNumber: `SN-${Math.floor(10000000 + Math.random() * 90000000)}`,
            locationId: randomLoc.id,
          }
        });
      }
    }
  }

  console.log("--- Seeding Complete! ---");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
