#!/usr/bin/env node

/**
 * Cleanup Old Groups Script
 *
 * Automatically deletes groups from Firestore that have been inactive
 * for more than 30 days. Runs via GitHub Actions on a scheduled basis.
 *
 * This script uses Firebase Admin SDK to connect to Firestore and
 * delete both groups and their associated expenses subcollection.
 */

import admin from 'firebase-admin';

// Configuration
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Initialize Firebase Admin SDK
function initializeFirebase() {
  try {
    // Check if we have a service account JSON (preferred method)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✓ Firebase initialized with service account');
    }
    // Fallback to individual credentials (for development)
    else if (process.env.VITE_FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.VITE_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
      });
      console.log('✓ Firebase initialized with environment variables');
    } else {
      throw new Error('No Firebase credentials found in environment variables');
    }
  } catch (error) {
    console.error('✗ Failed to initialize Firebase:', error.message);
    process.exit(1);
  }
}

// Main cleanup function
async function cleanupOldGroups() {
  console.log('🧹 Starting cleanup of old groups...\n');

  const db = admin.firestore();
  const cutoffDate = new Date(Date.now() - THIRTY_DAYS_MS);
  const cutoffTimestamp = admin.firestore.Timestamp.fromDate(cutoffDate);

  console.log(`📅 Cutoff date: ${cutoffDate.toISOString()}`);
  console.log(`   (Groups inactive since before this date will be deleted)\n`);

  let totalGroupsDeleted = 0;
  let totalExpensesDeleted = 0;

  try {
    // Query for groups with lastActivity older than 30 days
    const groupsSnapshot = await db.collection('groups')
      .where('lastActivity', '<', cutoffTimestamp)
      .get();

    if (groupsSnapshot.empty) {
      console.log('✓ No old groups found. Nothing to delete.');
      return { groupsDeleted: 0, expensesDeleted: 0 };
    }

    console.log(`📦 Found ${groupsSnapshot.size} group(s) to delete\n`);

    // Process each group
    for (const groupDoc of groupsSnapshot.docs) {
      const groupData = groupDoc.data();
      const groupId = groupDoc.id;
      const lastActivity = groupData.lastActivity?.toDate();
      const groupName = groupData.name || 'Unnamed Group';

      console.log(`🗑️  Deleting group: "${groupName}" (ID: ${groupId})`);
      console.log(`   Last activity: ${lastActivity?.toISOString() || 'Unknown'}`);

      try {
        // Delete all expenses in the group's subcollection
        const expensesSnapshot = await db
          .collection('groups')
          .doc(groupId)
          .collection('expenses')
          .get();

        if (!expensesSnapshot.empty) {
          const batch = db.batch();
          expensesSnapshot.docs.forEach(expenseDoc => {
            batch.delete(expenseDoc.ref);
          });
          await batch.commit();

          console.log(`   ✓ Deleted ${expensesSnapshot.size} expense(s)`);
          totalExpensesDeleted += expensesSnapshot.size;
        } else {
          console.log(`   ℹ No expenses to delete`);
        }

        // Delete the group document
        await groupDoc.ref.delete();
        console.log(`   ✓ Group deleted successfully\n`);
        totalGroupsDeleted++;

      } catch (error) {
        console.error(`   ✗ Error deleting group ${groupId}:`, error.message);
        // Continue with next group even if one fails
      }
    }

    console.log('─'.repeat(50));
    console.log(`✅ Cleanup completed successfully!`);
    console.log(`   Groups deleted: ${totalGroupsDeleted}`);
    console.log(`   Expenses deleted: ${totalExpensesDeleted}`);
    console.log('─'.repeat(50));

    return { groupsDeleted: totalGroupsDeleted, expensesDeleted: totalExpensesDeleted };

  } catch (error) {
    console.error('✗ Error during cleanup:', error);
    throw error;
  }
}

// Main execution
async function main() {
  const startTime = Date.now();

  try {
    initializeFirebase();

    const results = await cleanupOldGroups();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n⏱️  Total execution time: ${duration}s`);

    // Exit with success
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Cleanup failed:', error.message);

    // Exit with error code
    process.exit(1);
  }
}

// Run the script
main();
