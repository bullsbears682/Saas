#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔥 Firebase Configuration Setup for ProposalPro\n');
console.log('This script will help you create your .env file with Firebase configuration.\n');
console.log('📋 Before starting, make sure you have:');
console.log('   1. Created a Firebase project at https://console.firebase.google.com/');
console.log('   2. Enabled Authentication (Email/Password + Google)');
console.log('   3. Created a Firestore database');
console.log('   4. Got your Firebase config from Project Settings\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setupFirebase() {
  try {
    console.log('🔧 Enter your Firebase configuration values:\n');
    
    const apiKey = await askQuestion('Firebase API Key (AIzaSy...): ');
    const authDomain = await askQuestion('Auth Domain (your-project.firebaseapp.com): ');
    const projectId = await askQuestion('Project ID (your-project-id): ');
    const storageBucket = await askQuestion('Storage Bucket (your-project.appspot.com): ');
    const messagingSenderId = await askQuestion('Messaging Sender ID (123456789): ');
    const appId = await askQuestion('App ID (1:123456789:web:abcdef): ');
    
    const envContent = `# Firebase Configuration for ProposalPro
# Generated on ${new Date().toISOString()}

REACT_APP_FIREBASE_API_KEY=${apiKey}
REACT_APP_FIREBASE_AUTH_DOMAIN=${authDomain}
REACT_APP_FIREBASE_PROJECT_ID=${projectId}
REACT_APP_FIREBASE_STORAGE_BUCKET=${storageBucket}
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId}
REACT_APP_FIREBASE_APP_ID=${appId}

# Optional: Add these when ready for payments
# REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
# REACT_APP_STRIPE_STARTER_PRICE_ID=price_starter_id
# REACT_APP_STRIPE_PROFESSIONAL_PRICE_ID=price_professional_id

# Optional: Analytics
# REACT_APP_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
`;

    const envPath = path.join(__dirname, '.env');
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Success! Firebase configuration saved to .env file');
    console.log('\n🚀 Next steps:');
    console.log('   1. Restart your development server: npm start');
    console.log('   2. The demo mode banner should disappear');
    console.log('   3. Test authentication by clicking "Sign In"');
    console.log('   4. Create an account and test the dashboard');
    console.log('\n🎉 Your ProposalPro is now fully business-ready!');
    
  } catch (error) {
    console.error('\n❌ Error setting up Firebase:', error.message);
    console.log('\n💡 Manual setup:');
    console.log('   1. Create .env file in proposal-generator folder');
    console.log('   2. Add your Firebase configuration variables');
    console.log('   3. See FIREBASE_SETUP.md for detailed instructions');
  }
  
  rl.close();
}

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      setupFirebase();
    } else {
      console.log('Setup cancelled. Edit .env file manually or delete it to run this script again.');
      rl.close();
    }
  });
} else {
  setupFirebase();
}