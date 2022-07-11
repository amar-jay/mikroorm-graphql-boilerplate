import 'dotenv/config'
export const __prod = process.env.NODE_ENV === 'production'
export const __user = process.env.PG_USER || 'postgres' as const
export const __password = process.env.PG_PASSWD ||'' as const
export const __port= process.env.PORT || 8080 
export const __db = process.env.PG_DB || 'postgres' as const    //postgresql database name
