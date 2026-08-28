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

const target = process.argv[2];
if (!target) {
  console.log('\nUsage: node scripts/create-admin-user.js <email-or-uid>\n');
  process.exit(0);
}

async function run() {
  let uid = target;

  if (target.includes('@')) {
    console.log(`Looking up user by email: ${target}...`);
    try {
      const userRecord = await auth.getUserByEmail(target);
      uid = userRecord.uid;
      console.log(`Found user: ${userRecord.displayName || 'No Name'} (UID: ${uid})`);
    } catch (error) {
      console.error(`Error: User with email ${target} not found in Firebase Authentication.`);
      process.exit(1);
    }
  }

  console.log(`Setting role = "admin" for user ${uid} in Firestore...`);
  const userRef = db.collection('users').doc(uid);
  
  // Update or set role
  await userRef.set({ role: 'admin' }, { merge: true });
  
  console.log('Success! User has been granted the "admin" role in Firestore.\n');
  process.exit(0);
}

run().catch((error) => {
  console.error('Operation failed:', error);
  process.exit(1);
});
