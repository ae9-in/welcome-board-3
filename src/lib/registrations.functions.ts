import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sql, ensureTables } from "./db";

const Schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  contact: z.string().max(60).optional().nullable(),
  selected_competitions: z.array(z.string().min(1)).min(1).max(20),
});

export const submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Schema.parse(data))
  .handler(async ({ data }) => {
    await ensureTables();
    const offer_unlocked = data.selected_competitions.length >= 6;
    
    try {
      await sql`
        INSERT INTO registrations (name, email, contact, selected_competitions, offer_unlocked, offer_amount)
        VALUES (
          ${data.name},
          ${data.email},
          ${data.contact ?? null},
          ARRAY(SELECT jsonb_array_elements_text(${JSON.stringify(data.selected_competitions)}::jsonb)),
          ${offer_unlocked},
          1499
        )
      `;
    } catch (dbErr: any) {
      console.error("[Database] Registration insert failed:", dbErr);
      throw new Error(dbErr?.message || "Database insert failed");
    }

    return { ok: true, offer_unlocked };
  });