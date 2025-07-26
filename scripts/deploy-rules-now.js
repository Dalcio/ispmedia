const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying Firestore Rules...\n');

// Read the rules file
const rulesPath = path.join(__dirname, '..', 'firestore.rules');
const rules = fs.readFileSync(rulesPath, 'utf8');

console.log('📄 Rules to deploy:');
console.log('=' .repeat(50));
console.log(rules);
console.log('=' .repeat(50));

try {
  console.log('\n🔥 Attempting to deploy rules with Firebase CLI...');
  execSync('firebase deploy --only firestore:rules', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('\n✅ Rules deployed successfully!');
} catch (error) {
  console.log('\n❌ Firebase CLI deployment failed. Manual deployment required.');
  console.log('\n📋 MANUAL DEPLOYMENT STEPS:');
  console.log('1. Go to: https://console.firebase.google.com/project/ispmedia-70af7/firestore/rules');
  console.log('2. Copy the rules content shown above');
  console.log('3. Paste them in the Firebase Console');
  console.log('4. Click "Publish"');
  console.log('\n⚠️  This is REQUIRED for the comment system to work!');
}
