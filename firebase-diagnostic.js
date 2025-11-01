// Firebase Storage CORS Diagnostic Script
// Run this in your browser console to diagnose CORS issues

console.log('🔍 Firebase Storage CORS Diagnostic');
console.log('==================================');

// Check Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'Not set',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Not set',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not set',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'Not set',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'Not set',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'Not set',
};

console.log('📋 Firebase Configuration:');
console.log('API Key:', firebaseConfig.apiKey ? '✅ Set' : '❌ Not set');
console.log('Auth Domain:', firebaseConfig.authDomain);
console.log('Project ID:', firebaseConfig.projectId);
console.log('Storage Bucket:', firebaseConfig.storageBucket);
console.log('Messaging Sender ID:', firebaseConfig.messagingSenderId ? '✅ Set' : '❌ Not set');
console.log('App ID:', firebaseConfig.appId ? '✅ Set' : '❌ Not set');

// Check current domain
console.log('\n🌐 Current Domain:');
console.log('Origin:', window.location.origin);
console.log('Hostname:', window.location.hostname);

// Test CORS preflight request
console.log('\n🧪 Testing CORS Preflight Request...');

const testCORS = async () => {
  try {
    const response = await fetch('https://firebasestorage.googleapis.com/v0/b/techedu-solution.firebasestorage.app/o', {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization',
      },
    });
    
    console.log('✅ CORS Preflight Response:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.status === 200) {
      console.log('🎉 CORS is properly configured!');
    } else {
      console.log('❌ CORS preflight failed. Status:', response.status);
    }
  } catch (error) {
    console.log('❌ CORS preflight error:', error.message);
  }
};

// Test with different bucket names
const testBuckets = async () => {
  const buckets = [
    'techedu-solution.firebasestorage.app',
    'techedu-solution.firebasestorage.app',
    'techedu-solutions.appspot.com',
    'techedu-solution.appspot.com'
  ];
  
  console.log('\n🪣 Testing different bucket names...');
  
  for (const bucket of buckets) {
    try {
      const response = await fetch(`https://firebasestorage.googleapis.com/v0/b/${bucket}/o`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization',
        },
      });
      
      console.log(`Bucket: ${bucket} - Status: ${response.status} ${response.statusText}`);
      
      if (response.status === 200) {
        console.log(`✅ ${bucket} is accessible and CORS is configured!`);
      }
    } catch (error) {
      console.log(`❌ ${bucket} - Error: ${error.message}`);
    }
  }
};

// Run tests
testCORS();
testBuckets();

console.log('\n📝 Next Steps:');
console.log('1. If CORS preflight fails, configure CORS for your Firebase Storage bucket');
console.log('2. If bucket not found, check your Firebase project settings');
console.log('3. If all tests pass, the issue might be in your upload code');
console.log('4. Check browser Network tab for detailed error information');

// Export functions for manual testing
window.testCORS = testCORS;
window.testBuckets = testBuckets;
