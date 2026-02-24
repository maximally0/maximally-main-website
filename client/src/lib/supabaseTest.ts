// Test Supabase connectivity for main website
import { createClient } from '@supabase/supabase-js'

const testSupabaseConnection = async () => {
  console.log('🔄 [Main Website] Testing Supabase connectivity...')
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vbjqqspfosgelxhhqlks.supabase.co'
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZianFxc3Bmb3NnZWx4aGhxbGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0Mjk2ODYsImV4cCI6MjA3MzAwNTY4Nn0.fpbf1kNT-qI54aaHS0-To3jrRKU91lgwINzHEC_wUis'
  
  console.log('Using URL:', supabaseUrl)
  console.log('Using Key:', supabaseKey ? 'Present' : 'Missing')
  
  // Test 1: Basic fetch to REST API
  try {
    console.log('Test 1: Basic REST API connectivity')
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })
    console.log('✅ REST API Response:', response.status, response.statusText)
    
    if (!response.ok) {
      const text = await response.text()
      console.log('Response body:', text)
    }
  } catch (error) {
    console.error('❌ REST API Error:', error)
  }
  
  // Test 2: Test blogs table specifically
  try {
    console.log('Test 2: Blogs table connectivity')
    const freshClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
    
    const { data, error } = await freshClient
      .from('blogs')
      .select('id, title')
      .limit(1)
    
    if (error) {
      console.error('❌ Blogs query error:', error)
    } else {
      console.log('✅ Blogs query success:', data)
    }
  } catch (error) {
    console.error('❌ Blogs test error:', error)
  }
  
  // Test 3: Test profiles table
  try {
    console.log('Test 3: Profiles table connectivity')
    const freshClient = createClient(supabaseUrl, supabaseKey)
    
    const { data, error } = await freshClient
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Profiles query error:', error)
    } else {
      console.log('✅ Profiles query success:', data)
    }
  } catch (error) {
    console.error('❌ Profiles test error:', error)
  }
}

export { testSupabaseConnection }