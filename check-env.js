#!/usr/bin/env node

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Simple script to check if environment variables are properly loaded
console.log('Environment Variables Check:');
console.log('==========================');

const requiredVars = [
  'VITE_RECAPTCHA_SITE_KEY',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RECAPTCHA_SECRET_KEY',
  'SESSION_SECRET',
  'DATABASE_URL'
];

let allPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✓' : '✗';
  const displayValue = value ? `${value.substring(0, 10)}...` : 'NOT SET';
  
  console.log(`${status} ${varName}: ${displayValue}`);
  
  if (!value) {
    allPresent = false;
  }
});

console.log('==========================');
console.log(`Overall status: ${allPresent ? '✓ All variables present' : '✗ Some variables missing'}`);

if (!allPresent) {
  console.log('\nMake sure to set all required environment variables in your deployment platform.');
  console.log('Note: This is just a warning. Build will continue...');
}