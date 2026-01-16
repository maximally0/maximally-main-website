#!/usr/bin/env ts-node
/**
 * Validate Admin Routes Script
 * 
 * This script checks that all admin panel API calls have corresponding
 * backend routes registered in the Netlify function.
 * 
 * Run: npm run validate:admin-routes
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RouteCheck {
  endpoint: string;
  method: string;
  file: string;
  line: number;
  registered: boolean;
  routeModule?: string;
}

// Admin panel source directory (relative to maximally-main-website)
const ADMIN_PANEL_SRC = path.join(__dirname, '../../admin-panel/src');
const NETLIFY_FUNCTION = path.join(__dirname, '../netlify/functions/api.ts');
const SERVER_ROUTES = path.join(__dirname, '../server/routes');

// Patterns to find API calls in admin panel
const API_CALL_PATTERNS = [
  /fetch\([`'"]([^`'"]*\/api\/admin\/[^`'"]*)[`'"]/g,
  /fetch\(\s*`\$\{[^}]+\}(\/api\/admin\/[^`]*)`/g,
  /callMainWebsiteApi\([`'"]([^`'"]*\/api\/admin\/[^`'"]*)[`'"]/g,
  /getApiBaseUrl\(\)\s*\+\s*[`'"]([^`'"]*\/api\/admin\/[^`'"]*)[`'"]/g,
];

// Patterns to find route registrations in backend
const ROUTE_REGISTRATION_PATTERNS = [
  /app\.(get|post|put|patch|delete)\([`'"]([^`'"]*\/api\/admin\/[^`'"]*)[`'"]/g,
];

function findAdminApiCalls(): RouteCheck[] {
  const checks: RouteCheck[] = [];
  
  function scanDirectory(dir: string) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        
        // Look for fetch calls with /api/admin/ endpoints
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          // Skip comments
          if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;
          
          // Look for fetch or callMainWebsiteApi calls
          if (line.includes('fetch(') || line.includes('callMainWebsiteApi(')) {
            // Get context (current line + previous 10 lines for function/comment context)
            const contextBefore = lines.slice(Math.max(0, i - 10), i + 1).join('\n');
            const contextAfter = lines.slice(i, Math.min(i + 6, lines.length)).join('\n');
            
            // Skip if it's in a comment, example, or documentation
            if (contextBefore.includes('Example:') || 
                contextBefore.includes('example') ||
                contextAfter.includes('// Example:') || 
                contextAfter.includes('* Example:') ||
                contextAfter.includes('/**')) {
              continue;
            }
            
            // Extract endpoint from template string
            // Match everything from /api/admin/ until we hit a backtick, quote, or closing brace
            const endpointMatch = contextAfter.match(/\/api\/admin\/[^`'"]+/);
            if (!endpointMatch) continue;
            
            let endpoint = endpointMatch[0];
            
            // Normalize endpoint - replace ${variable} or ${variable.property} with :id
            endpoint = endpoint.replace(/\$\{[^}]+\}/g, ':id');
            
            // Clean up any trailing characters that aren't part of the path
            endpoint = endpoint.replace(/[`'"\s,;].*$/, '');
            
            // Extract method from context
            const method = extractMethodFromContext(contextAfter);
            
            checks.push({
              endpoint,
              method,
              file: path.relative(process.cwd(), filePath),
              line: i + 1,
              registered: false,
            });
          }
        }
      }
    }
  }
  
  scanDirectory(ADMIN_PANEL_SRC);
  
  // Deduplicate checks (same endpoint + method)
  const uniqueChecks = new Map<string, RouteCheck>();
  for (const check of checks) {
    const key = `${check.method} ${check.endpoint}`;
    if (!uniqueChecks.has(key)) {
      uniqueChecks.set(key, check);
    }
  }
  
  return Array.from(uniqueChecks.values());
}

function extractMethodFromContext(context: string): string {
  // Check for explicit method in fetch options
  if (/method:\s*['"]POST['"]/.test(context)) return 'POST';
  if (/method:\s*['"]PUT['"]/.test(context)) return 'PUT';
  if (/method:\s*['"]PATCH['"]/.test(context)) return 'PATCH';
  if (/method:\s*['"]DELETE['"]/.test(context)) return 'DELETE';
  
  // Check for callMainWebsiteApi helper (second parameter is method)
  const apiHelperMatch = context.match(/callMainWebsiteApi\([^,]+,\s*['"](\w+)['"]/);
  if (apiHelperMatch) {
    return apiHelperMatch[1].toUpperCase();
  }
  
  return 'GET';
}

function findRegisteredRoutes(): Map<string, string> {
  const routes = new Map<string, string>();
  
  function scanRouteFiles(dir: string) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanRouteFiles(filePath);
      } else if (file.endsWith('.ts')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        for (const pattern of ROUTE_REGISTRATION_PATTERNS) {
          const matches = [...content.matchAll(pattern)];
          for (const match of matches) {
            const method = match[1].toUpperCase();
            const endpoint = match[2].replace(/:[^/]+/g, ':id'); // Normalize params
            const key = `${method} ${endpoint}`;
            routes.set(key, path.relative(process.cwd(), filePath));
          }
        }
      }
    }
  }
  
  scanRouteFiles(SERVER_ROUTES);
  return routes;
}

function checkRouteRegistration(checks: RouteCheck[], registeredRoutes: Map<string, string>): RouteCheck[] {
  return checks.map(check => {
    const key = `${check.method} ${check.endpoint}`;
    const routeModule = registeredRoutes.get(key);
    
    return {
      ...check,
      registered: !!routeModule,
      routeModule,
    };
  });
}

function checkNetlifyFunctionRegistration(): string[] {
  const content = fs.readFileSync(NETLIFY_FUNCTION, 'utf-8');
  const registrations: string[] = [];
  
  const pattern = /register(\w+Routes)\(app\)/g;
  const matches = [...content.matchAll(pattern)];
  
  for (const match of matches) {
    registrations.push(match[1]);
  }
  
  return registrations;
}

function main() {
  console.log('🔍 Validating Admin Panel API Routes...\n');
  
  // Find all admin API calls
  console.log('📋 Step 1: Finding admin API calls in admin panel...');
  const apiCalls = findAdminApiCalls();
  console.log(`   Found ${apiCalls.length} admin API calls\n`);
  
  // Find all registered routes
  console.log('📋 Step 2: Finding registered routes in backend...');
  const registeredRoutes = findRegisteredRoutes();
  console.log(`   Found ${registeredRoutes.size} registered admin routes\n`);
  
  // Check registration
  console.log('📋 Step 3: Checking route registration...');
  const checks = checkRouteRegistration(apiCalls, registeredRoutes);
  
  // Check Netlify function registration
  console.log('📋 Step 4: Checking Netlify function registration...');
  const netlifyRegistrations = checkNetlifyFunctionRegistration();
  console.log(`   Found ${netlifyRegistrations.length} route module registrations\n`);
  
  // Report results
  const missing = checks.filter(c => !c.registered);
  const registered = checks.filter(c => c.registered);
  
  console.log('═══════════════════════════════════════════════════════════\n');
  
  if (missing.length === 0) {
    console.log('✅ SUCCESS: All admin API calls have registered routes!\n');
    console.log(`   Total API calls: ${apiCalls.length}`);
    console.log(`   All registered: ${registered.length}`);
    console.log(`   Missing: 0\n`);
    process.exit(0);
  } else {
    console.log('❌ FAILURE: Some admin API calls are missing backend routes!\n');
    console.log(`   Total API calls: ${apiCalls.length}`);
    console.log(`   Registered: ${registered.length}`);
    console.log(`   Missing: ${missing.length}\n`);
    
    console.log('Missing Routes:\n');
    missing.forEach(check => {
      console.log(`   ❌ ${check.method} ${check.endpoint}`);
      console.log(`      Called in: ${check.file}:${check.line}`);
      console.log('');
    });
    
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('💡 To fix:');
    console.log('   1. Create route module in server/routes/admin-*.ts');
    console.log('   2. Implement the missing endpoints');
    console.log('   3. Import in netlify/functions/api.ts');
    console.log('   4. Register in the route registration section');
    console.log('   5. Run this script again to verify\n');
    
    process.exit(1);
  }
}

main();
