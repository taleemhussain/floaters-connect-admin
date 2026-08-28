const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Load environment variables manually from apps/admin-api/.env
const envPath = path.resolve(__dirname, '..', 'apps', 'admin-api', '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = (match[2] || '').trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !privateKey) {
  console.error('Error: Firebase Admin credentials not found in apps/admin-api/.env');
  process.exit(1);
}

// Clean private key format
privateKey = privateKey.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey,
  })
});

const db = admin.firestore();
const auth = admin.auth();

const email = process.argv[2] || 'admin@floaters.com';
const password = process.argv[3] || 'password123';

async function seed() {
  console.log(`\nStarting Firebase Admin seeding process...`);
  console.log(`Target account: ${email}`);

  let uid = '';
  
  try {
    // Check if user already exists in Firebase Auth
    console.log(`Checking if ${email} already exists in Firebase Auth...`);
    const userRecord = await auth.getUserByEmail(email);
    uid = userRecord.uid;
    console.log(`User already exists in Authentication with UID: ${uid}`);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      // User doesn't exist, create it
      console.log(`User not found. Creating new user in Firebase Auth...`);
      const userRecord = await auth.createUser({
        email: email,
        password: password,
        displayName: 'System Admin',
        emailVerified: true,
      });
      uid = userRecord.uid;
      console.log(`Successfully created user in Auth with UID: ${uid}`);
    } else {
      throw error;
    }
  }

  // Set/merge document in Firestore with role "admin"
  console.log(`Configuring user role as "admin" in Firestore collection "users/${uid}"...`);
  const userRef = db.collection('users').doc(uid);
  await userRef.set({
    uid: uid,
    email: email,
    displayName: 'System Admin',
    role: 'admin',
    onboardingStatus: 'registered',
    createdAt: new Date().toISOString(),
    isBanned: false
  }, { merge: true });

  console.log(`\n🎉 Seeding Successful!`);
  console.log(`-----------------------------------------------`);
  console.log(`You can now log in to the dashboard using:`);
  console.log(`Email:    ${email}`);
  console.log(`Password: ${password}`);
  console.log(`-----------------------------------------------\n`);
  process.exit(0);
}

seed().catch((error) => {
  console.error('\n❌ Seeding failed:', error.message || error);
  process.exit(1);
});
