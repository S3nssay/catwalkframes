// Simple test script to check both SMS and Email functionality

// Get the email address and phone number from command-line args
const args = process.argv.slice(2);
const email = args[0];
const phoneNumber = args[1];

if (!email || !phoneNumber) {
  console.error('Usage: node test-notifications.js <email_address> <phone_number>');
  console.error('Example: node test-notifications.js user@example.com +447123456789');
  process.exit(1);
}

// Make sure both endpoints are hit
async function runTests() {
  try {
    console.log(`Testing email to: ${email}`);
    const emailResponse = await fetch('http://localhost:5000/api/test-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const emailResult = await emailResponse.json();
    console.log('Email test result:', emailResult);
    
    console.log(`\nTesting SMS to: ${phoneNumber}`);
    const smsResponse = await fetch('http://localhost:5000/api/test-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });
    
    const smsResult = await smsResponse.json();
    console.log('SMS test result:', smsResult);
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

runTests();