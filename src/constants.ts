import "dotenv/config";
export const __prod = process.env.NODE_ENV === "production";
export const __user = process.env.PG_USER || "postgres";
export const __password = process.env.PG_PASSWD || "";
export const __port = process.env.PORT || 8080;
export const __db = process.env.PG_DB || "postgres"; //postgresql database name
export const __sessions_secret = process.env.SESSIONS_SECRET || "Kofi is a boy";
