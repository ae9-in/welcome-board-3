import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sql, ensureTables } from "./db";

const Schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  idea: z.string().min(5).max(5000),
});

export const submitEventIdea = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Schema.parse(data))
  .handler(async ({ data }) => {
    await ensureTables();

    try {
      await sql`
        INSERT INTO event_ideas (name, email, idea)
        VALUES (${data.name}, ${data.email}, ${data.idea})
      `;
    } catch (dbErr: any) {
      console.error("[Database] Event idea insert failed:", dbErr);
      throw new Error(dbErr?.message || "Database insert failed");
    }

    return { ok: true };
  });
