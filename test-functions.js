/**
 * Simple test script to verify Netlify functions work locally
 */

async function testFunctions() {
  const baseUrl = 'http://localhost:8888/.netlify/functions';
  
  console.log('🧪 Testing Netlify Functions...\n');
  
  // Test 1: Get blogs
  try {
    console.log('📚 Testing blogs/getAll...');
    const blogsResponse = await fetch(`${baseUrl}/blogs/getAll`);
    const blogsResult = await blogsResponse.json();
    console.log('✅ Blogs response:', blogsResult.success ? 'Success' : 'Failed');
    if (!blogsResult.success) {
      console.log('❌ Error:', blogsResult.error);
    }
  } catch (error) {
    console.log('❌ Blogs test failed:', error.message);
  }
  
  // Test 2: Get hackathons
  try {
    console.log('\n🏆 Testing hackathons/getAll...');
    const hackathonsResponse = await fetch(`${baseUrl}/hackathons/getAll`);
    const hackathonsResult = await hackathonsResponse.json();
    console.log('✅ Hackathons response:', hackathonsResult.success ? 'Success' : 'Failed');
    if (!hackathonsResult.success) {
      console.log('❌ Error:', hackathonsResult.error);
    }
  } catch (error) {
    console.log('❌ Hackathons test failed:', error.message);
  }
  
  // Test 3: Login (should fail without credentials)
  try {
    console.log('\n🔐 Testing auth/login...');
    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'wrongpassword' })
    });
    const loginResult = await loginResponse.json();
    console.log('✅ Login response:', loginResult.success ? 'Unexpected success' : 'Expected failure');
    if (!loginResult.success) {
      console.log('✅ Expected error:', loginResult.error);
    }
  } catch (error) {
    console.log('❌ Login test failed:', error.message);
  }
  
  console.log('\n🎉 Function tests completed!');
}

// Run tests if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  testFunctions().catch(console.error);
}

export { testFunctions };