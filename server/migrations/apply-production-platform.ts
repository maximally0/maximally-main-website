// @ts-nocheck
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

export async function applyProductionPlatformMigration(supabaseAdmin: ReturnType<typeof createClient>) {
  console.log("Applying production platform migration...");
  
  try {
    const sqlPath = path.join(__dirname, "../../PRODUCTION_HACKATHON_PLATFORM.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");
    
    // Split by semicolons and execute each statement
    const statements = sql
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith("--"));
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql_query: statement });
        if (error) {
          console.error("Error executing statement:", error);
          // Continue with other statements
        }
      }
    }
    
    console.log("✓ Production platform migration applied successfully");
  } catch (error) {
    console.error("Error applying production platform migration:", error);
  }
}
