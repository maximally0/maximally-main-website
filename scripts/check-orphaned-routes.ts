#!/usr/bin/env node
/**
 * Orphaned Routes Checker
 * 
 * This script checks for API endpoints that are called from the frontend
 * but might not exist in the backend
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RouteCheck {
  route: string;
  files: string[];
  exists: boolean;
}

function extractApiCalls(dir: string, baseDir: string = dir): string[] {
  const apiCalls: string[] = [];
  
  function scanDirectory(currentDir: string) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
        scanDirectory(fullPath);
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        // Match apiRequest, fetch, axios calls with /api/ paths
        const patterns = [
          /apiRequest\s*\(\s*['"]([^'"]+)['"]/g,
          /fetch\s*\(\s*['"]([^'"]+)['"]/g,
          /axios\.\w+\s*\(\s*['"]([^'"]+)['"]/g,
          /\.get\s*\(\s*['"]([^'"]+)['"]/g,
          /\.post\s*\(\s*['"]([^'"]+)['"]/g,
          /\.put\s*\(\s*['"]([^'"]+)['"]/g,
          /\.patch\s*\(\s*['"]([^'"]+)['"]/g,
          /\.delete\s*\(\s*['"]([^'"]+)['"]/g,
        ];
        
        patterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const url = match[1];
            if (url.startsWith('/api/')) {
              apiCalls.push(url);
            }
          }
        });
      }
    }
  }
  
  scanDirectory(dir);
  return [...new Set(apiCalls)]; // Remove duplicates
}

function extractBackendRoutes(dir: string): string[] {
  const routes: string[] = [];
  
  function scanDirectory(currentDir: string) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile() && item.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        // Match app.get, app.post, etc.
        const routeRegex = /app\.(get|post|put|patch|delete)\s*\(\s*["']([^"']+)["']/g;
        let match;
        
        while ((match = routeRegex.exec(content)) !== null) {
          routes.push(match[2]);
        }
      }
    }
  }
  
  scanDirectory(dir);
  return [...new Set(routes)];
}

function normalizeRoute(route: string): string {
  // Remove query parameters and normalize dynamic segments
  return route
    .split('?')[0]
    .replace(/\/\d+/g, '/:id')
    .replace(/\/[a-f0-9-]{36}/g, '/:id')
    .replace(/\/[a-z0-9-]+$/g, '/:param');
}

function checkOrphanedRoutes() {
  console.log('🔍 Checking for orphaned API routes...\n');
  
  const clientDir = path.join(__dirname, '../client/src');
  const serverDir = path.join(__dirname, '../server');
  const netlifyDir = path.join(__dirname, '../netlify/functions');
  
  const frontendCalls = extractApiCalls(clientDir);
  const backendRoutes = [
    ...extractBackendRoutes(serverDir),
    ...extractBackendRoutes(netlifyDir)
  ];
  
  console.log(`📊 Found ${frontendCalls.length} unique API calls in frontend`);
  console.log(`📊 Found ${backendRoutes.length} unique routes in backend\n`);
  
  const orphaned: string[] = [];
  const matched: string[] = [];
  
  frontendCalls.forEach(call => {
    const normalizedCall = normalizeRoute(call);
    const exists = backendRoutes.some(route => {
      const normalizedRoute = normalizeRoute(route);
      return normalizedRoute === normalizedCall || route === call;
    });
    
    if (exists) {
      matched.push(call);
    } else {
      orphaned.push(call);
    }
  });
  
  if (orphaned.length > 0) {
    console.log('⚠️  POTENTIALLY ORPHANED ROUTES:\n');
    console.log('These API endpoints are called from the frontend but might not exist in the backend:\n');
    orphaned.forEach(route => {
      console.log(`   ❌ ${route}`);
    });
    console.log('\n💡 Note: Some routes might use dynamic parameters. Please verify manually.\n');
  }
  
  console.log(`✅ ${matched.length} routes verified`);
  if (orphaned.length > 0) {
    console.log(`⚠️  ${orphaned.length} routes need verification\n`);
  } else {
    console.log('✅ No orphaned routes detected!\n');
  }
}

checkOrphanedRoutes();
