# 🚀 Deploy Firestore Indexes - Complete Setup

## Prerequisites
Before deploying indexes, make sure you have:
- Firebase CLI installed: `npm install -g firebase-tools`
- Authenticated with Firebase: `firebase login`

## Deploy Steps

### 1. Deploy Firestore Indexes
```bash
npm run deploy-firestore-indexes
```

### 2. Alternative Manual Deployment
If the script doesn't work, you can deploy manually:
```bash
firebase deploy --only firestore:indexes
```

### 3. Check Index Status
After deployment, check the Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ispmedia-70af7`
3. Navigate to Firestore Database → Indexes
4. Wait for indexes to show "Enabled" status (usually 2-5 minutes)

## Expected Indexes
The deployment will create these indexes:

### Tracks Collection
- **createdBy** (Ascending) + **createdAt** (Descending)
- **genre** (Ascending) + **createdAt** (Descending)

### Playlists Collection  
- **createdBy** (Ascending) + **createdAt** (Descending)

## Verification
Once indexes are deployed and enabled:
1. Refresh your ISPmedia app
2. Open the dashboard drawer
3. Your tracks should load without any index errors
4. Play, edit, and delete functions should work properly

## Troubleshooting
If you get errors:
- **"Firebase CLI not found"**: Run `npm install -g firebase-tools`
- **"Not authenticated"**: Run `firebase login`
- **"Index building"**: Wait 2-5 minutes and refresh the app

The app will work even during index building, but performance may be limited until indexes are ready.
