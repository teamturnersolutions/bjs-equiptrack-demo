import { auth } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user;
}

export async function hasPermission(permission: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  
  const permissions = (user as any).permissions || [];
  return permissions.includes(permission);
}

export async function requirePermission(permission: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required.");
  }
  
  const permissions = (user as any).permissions || [];
  if (!permissions.includes(permission)) {
    throw new Error(`Forbidden: Missing permission "${permission}".`);
  }
  
  return user;
}
