import dotenv from "dotenv";

// Load local env first so other modules that access process.env at import
// time will see the values (this file is the dev entrypoint).
dotenv.config({ path: ".env.local", override: false });

// Dynamically import the real entrypoint after env is loaded.
import("./index");
