import { createServerFn } from "@tanstack/react-start";
import { requireLocalAuth } from "./auth";
import { sql, ensureTables } from "./db";

async function assertAdmin(userId: string) {
  if (userId !== "local-admin-uuid") throw new Error("Forbidden");
}

export const listEventIdeas = createServerFn({ method: "GET" })
  .middleware([requireLocalAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    try {
      await ensureTables();
      const data = await sql`
        SELECT id, name, email, idea, created_at
        FROM event_ideas
        ORDER BY created_at DESC
      `;
      return data ?? [];
    } catch (dbErr: any) {
      console.error("[Database] Failed to list event ideas:", dbErr);
      throw new Error(dbErr?.message || "Failed to fetch event ideas");
    }
  });

export const listRegistrations = createServerFn({ method: "GET" })
  .middleware([requireLocalAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    try {
      await ensureTables();
      const data = await sql`
        SELECT id, name, email, contact, selected_competitions, offer_unlocked, offer_amount, created_at
        FROM registrations
        ORDER BY created_at DESC
      `;
      return data ?? [];
    } catch (dbErr: any) {
      console.error("[Database] Failed to list registrations:", dbErr);
      throw new Error(dbErr?.message || "Failed to fetch registrations");
    }
  });

export const getCurrentRole = createServerFn({ method: "GET" })
  .middleware([requireLocalAuth])
  .handler(async ({ context }) => {
    return { isAdmin: context.userId === "local-admin-uuid", userId: context.userId };
  });
