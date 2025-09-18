import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testWhatsAppFeatures() {
  console.log('🧪 Testing new WhatsApp features...\n');

  // Test 1: Send property details via WhatsApp
  console.log('1️⃣ Testing send property details via WhatsApp');
  try {
    const response = await fetch(`${BASE_URL}/api/send-property-whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        propertyId: 1, // Assuming property ID 1 exists
        phoneNumber: '+441234567890',
        customerName: 'Test Customer'
      })
    });

    const result = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, result);
  } catch (error) {
    console.log(`   ❌ Error:`, error.message);
  }

  console.log('');

  // Test 2: Set up property alert via WhatsApp
  console.log('2️⃣ Testing property alert setup via WhatsApp');
  try {
    const response = await fetch(`${BASE_URL}/api/property-alert-whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phoneNumber: '+441234567890',
        customerName: 'Test Customer',
        criteria: {
          minPrice: 200000,
          maxPrice: 500000,
          propertyType: 'house',
          bedrooms: 3,
          area: 'London'
        }
      })
    });

    const result = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, result);
  } catch (error) {
    console.log(`   ❌ Error:`, error.message);
  }

  console.log('');

  // Test 3: Test favourites endpoint (requires authentication)
  console.log('3️⃣ Testing favourites endpoint (without auth - should fail)');
  try {
    const response = await fetch(`${BASE_URL}/api/favourites`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, result);
  } catch (error) {
    console.log(`   ❌ Error:`, error.message);
  }

  console.log('');

  // Test 4: Get properties list
  console.log('4️⃣ Testing properties list');
  try {
    const response = await fetch(`${BASE_URL}/api/properties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Properties found: ${Array.isArray(result) ? result.length : 'N/A'}`);

    if (Array.isArray(result) && result.length > 0) {
      console.log(`   First property: ${result[0].title} - £${result[0].price}`);
    }
  } catch (error) {
    console.log(`   ❌ Error:`, error.message);
  }

  console.log('\n✅ WhatsApp features testing completed!');
}

// Run the tests
testWhatsAppFeatures().catch(console.error);