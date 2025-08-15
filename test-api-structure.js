// Test script for checking API response structure
const API_BASE = 'http://localhost:8000/api';

async function testAPIStructure() {
  try {
    console.log('🧪 Testing API Response Structure...\n');

    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@balozone.com',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    const token = loginData.authorization?.token;
    console.log('✅ Admin login successful');

    // Step 2: Test products search API structure
    console.log('\n2. Testing products search API structure...');
    const productsResponse = await fetch(`${API_BASE}/dashboard/products?per_page=5`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    const productsData = await productsResponse.json();
    console.log('📊 Products API Response Structure:');
    console.log('- success:', productsData.success);
    console.log('- data.current_page:', productsData.data?.current_page);
    console.log('- data.total:', productsData.data?.total);
    console.log('- data.data length:', productsData.data?.data?.length);
    console.log('- First product name:', productsData.data?.data?.[0]?.name);

    // Step 3: Test categories API structure
    console.log('\n3. Testing categories API structure...');
    const categoriesResponse = await fetch(`${API_BASE}/dashboard/categories?per_page=5`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    const categoriesData = await categoriesResponse.json();
    console.log('📊 Categories API Response Structure:');
    console.log('- Has success field:', 'success' in categoriesData);
    console.log('- current_page:', categoriesData.current_page);
    console.log('- total:', categoriesData.total);
    console.log('- data length:', categoriesData.data?.length);
    console.log('- First category name:', categoriesData.data?.[0]?.name);

    // Step 4: Test campaign products API structure
    console.log('\n4. Testing campaign products API structure...');
    const campaignProductsResponse = await fetch(`${API_BASE}/dashboard/sale-campaigns/1/products`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    const campaignProductsData = await campaignProductsResponse.json();
    console.log('📊 Campaign Products API Response Structure:');
    console.log('- Has success field:', 'success' in campaignProductsData);
    console.log('- Response type:', typeof campaignProductsData);
    console.log('- Data structure:', Object.keys(campaignProductsData));

    console.log('\n🎉 API structure analysis complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPIStructure();
