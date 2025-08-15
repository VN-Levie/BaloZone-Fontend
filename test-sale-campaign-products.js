// Test script for Sale Campaign Products Management
// Run this with: node test-sale-campaign-products.js

const API_BASE = 'http://localhost:8000/api';

// Test function
async function testSaleCampaignProducts() {
  try {
    console.log('🧪 Testing Sale Campaign Products Management...\n');

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

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.authorization?.token;

    if (!token) {
      throw new Error('No token received from login');
    }

    console.log('✅ Admin login successful');

    // Step 2: Get all sale campaigns
    console.log('\n2. Getting all sale campaigns...');
    const campaignsResponse = await fetch(`${API_BASE}/dashboard/sale-campaigns`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!campaignsResponse.ok) {
      throw new Error(`Get campaigns failed: ${campaignsResponse.status}`);
    }

    const campaignsData = await campaignsResponse.json();
    console.log(`✅ Found ${campaignsData.data?.length || 0} campaigns`);

    if (!campaignsData.data || campaignsData.data.length === 0) {
      console.log('⚠️  No campaigns found, creating a test campaign...');

      // Create a test campaign
      const formData = new FormData();
      formData.append('name', 'Test Campaign for Products');
      formData.append('slug', 'test-campaign-products');
      formData.append('description', 'Test campaign for testing product management');
      formData.append('start_date', '2025-01-01T00:00:00.000000Z');
      formData.append('end_date', '2025-12-31T23:59:59.000000Z');
      formData.append('status', 'active');
      formData.append('is_featured', '0');
      formData.append('priority', '50');

      const createResponse = await fetch(`${API_BASE}/dashboard/sale-campaigns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formData
      });

      if (!createResponse.ok) {
        throw new Error(`Create campaign failed: ${createResponse.status}`);
      }

      const newCampaign = await createResponse.json();
      console.log('✅ Test campaign created successfully');
      campaignsData.data = [newCampaign.data];
    }

    const testCampaign = campaignsData.data[0];
    const campaignId = testCampaign.id;

    // Step 3: Get campaign products
    console.log(`\n3. Getting products for campaign ${campaignId}...`);
    const campaignProductsResponse = await fetch(`${API_BASE}/dashboard/sale-campaigns/${campaignId}/products`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!campaignProductsResponse.ok) {
      throw new Error(`Get campaign products failed: ${campaignProductsResponse.status}`);
    }

    const campaignProductsData = await campaignProductsResponse.json();
    console.log(`✅ Campaign has ${campaignProductsData.data?.length || 0} products`);

    // Step 4: Search available products
    console.log('\n4. Searching available products...');
    const productsResponse = await fetch(`${API_BASE}/dashboard/products?per_page=5`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!productsResponse.ok) {
      throw new Error(`Search products failed: ${productsResponse.status}`);
    }

    const productsData = await productsResponse.json();
    console.log(`✅ Found ${productsData.data?.data?.length || 0} available products`);

    // Step 5: Add a product to campaign (if we have products)
    if (productsData.data?.data && productsData.data.data.length > 0) {
      const testProduct = productsData.data.data[0];
      console.log(`\n5. Adding product "${testProduct.name}" to campaign...`);

      const addProductResponse = await fetch(`${API_BASE}/dashboard/sale-campaigns/${campaignId}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          products: [{
            product_id: testProduct.id,
            sale_price: Math.round(testProduct.price * 0.8),
            discount_type: 'percentage',
            max_quantity: 100
          }]
        })
      });

      if (!addProductResponse.ok) {
        const errorData = await addProductResponse.text();
        console.log(`⚠️  Add product failed: ${addProductResponse.status} - ${errorData}`);
      } else {
        console.log('✅ Product added to campaign successfully');

        // Step 6: Remove the product from campaign
        console.log('\n6. Removing product from campaign...');
        const removeResponse = await fetch(`${API_BASE}/dashboard/sale-campaigns/${campaignId}/products/${testProduct.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!removeResponse.ok) {
          console.log(`⚠️  Remove product failed: ${removeResponse.status}`);
        } else {
          console.log('✅ Product removed from campaign successfully');
        }
      }
    } else {
      console.log('⚠️  No products available to test with');
    }

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSaleCampaignProducts();
