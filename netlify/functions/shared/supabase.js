/**
 * Legacy shim — re-exports from db.js so existing imports keep working.
 * All DB queries go to Neon. Auth goes to Neon Auth service.
 */
export { getSupabaseAdmin, getDb, getSql, getNeonAuthUrl, createResponse, parseBody } from './db.js';

export function validateMethod(event, allowedMethods) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS' }, body: '' };
  }
  if (!allowedMethods.includes(event.httpMethod)) {
    return { statusCode: 405, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }
  return null;
}
