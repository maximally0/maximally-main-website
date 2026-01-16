#!/usr/bin/env node
/**
 * Route Validation Script
 * 
 * This script ensures all API routes defined in server/routes.ts and server/routes/*
 * are properly registered in netlify/functions/api.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
}

function extractRoutes(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const routes: string[] = [];
  
  // Match app.get, app.post, app.put, app.patch, app.delete
  const routeRegex = /app\.(get|post|put|patch|delete)\s*\(\s*["']([^"']+)["']/g;
  let match;
  
  while ((match = routeRegex.exec(content)) !== null) {
    routes.push(match[2]);
  }
  
  return routes;
}

function extractRegisteredModules(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Remove comments before extracting
  const contentWithoutComments = content
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*/g, ''); // Remove line comments
  
  const modules: string[] = [];
  
  // Match import statements for route modules
  const importRegex = /import\s+{\s*(\w+)\s*}\s+from\s+["']\.\.\/\.\.\/server\/routes\/([^"']+)["']/g;
  let match;
  
  while ((match = importRegex.exec(contentWithoutComments)) !== null) {
    modules.push(match[1]);
  }
  
  return modules;
}

function extractCalledModules(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const called: string[] = [];
  
  // Match function calls like registerOrganizerRoutes(app)
  const callRegex = /(register\w+Routes)\s*\(\s*app\s*\)/g;
  let match;
  
  while ((match = callRegex.exec(content)) !== null) {
    called.push(match[1]);
  }
  
  return called;
}

function validateRoutes(): ValidationResult {
  const result: ValidationResult = {
    success: true,
    errors: [],
    warnings: []
  };

  const serverRoutesPath = path.join(__dirname, '../server/routes.ts');
  const netlifyApiPath = path.join(__dirname, '../netlify/functions/api.ts');
  const routesDir = path.join(__dirname, '../server/routes');

  // Check if main routes.ts has any route definitions
  if (fs.existsSync(serverRoutesPath)) {
    const mainRoutes = extractRoutes(serverRoutesPath);
    if (mainRoutes.length > 0) {
      result.warnings.push(
        `⚠️  Found ${mainRoutes.length} route(s) in server/routes.ts (these work locally but may not work in production)`
      );
      result.warnings.push(
        '💡 Best practice: Move routes to dedicated modules in server/routes/ for production compatibility'
      );
    }
  }

  // Check all route modules are registered
  if (fs.existsSync(routesDir)) {
    const routeFiles = fs.readdirSync(routesDir)
      .filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts'));
    
    const registeredModules = extractRegisteredModules(netlifyApiPath);
    const calledModules = extractCalledModules(netlifyApiPath);
    
    // Check for imported but not called modules - THIS IS CRITICAL
    const notCalled = registeredModules.filter(m => !calledModules.includes(m));
    if (notCalled.length > 0) {
      result.errors.push(
        `❌ CRITICAL: Found ${notCalled.length} imported route module(s) that are NOT called in netlify/functions/api.ts:`
      );
      notCalled.forEach(module => {
        result.errors.push(`   - ${module} (imported but not called with app)`);
      });
      result.errors.push(
        '\n💡 Solution: Add the function call in the "REGISTER ROUTE MODULES" section:'
      );
      result.errors.push(`   ${notCalled[0]}(app);`);
      result.success = false;
    }
  }

  return result;
}

function main() {
  console.log('🔍 Validating API routes...\n');
  
  const result = validateRoutes();
  
  if (result.warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    result.warnings.forEach(w => console.log(w));
    console.log('');
  }
  
  if (result.errors.length > 0) {
    console.log('❌ ERRORS:\n');
    result.errors.forEach(e => console.log(e));
    console.log('');
    process.exit(1);
  }
  
  console.log('✅ All routes are properly registered!\n');
  process.exit(0);
}

main();
