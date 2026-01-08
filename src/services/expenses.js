import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Group operations
export const createGroup = async (userId, groupName = 'Nuevo Grupo') => {
  try {
    const groupRef = await addDoc(collection(db, 'groups'), {
      creatorId: userId,
      name: groupName,
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp()
    });

    // Update user's activeGroupId
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      activeGroupId: groupRef.id
    });

    return groupRef.id;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

export const getGroup = async (groupId) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);

    if (groupDoc.exists()) {
      return { id: groupDoc.id, ...groupDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting group:', error);
    throw error;
  }
};

export const updateGroupActivity = async (groupId) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
      lastActivity: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating group activity:', error);
  }
};

export const closeGroup = async (userId, groupId) => {
  try {
    // Remove activeGroupId from user
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      activeGroupId: null
    });
  } catch (error) {
    console.error('Error closing group:', error);
    throw error;
  }
};

// Expense operations
export const addExpense = async (groupId, expenseData) => {
  try {
    const expenseRef = await addDoc(
      collection(db, 'groups', groupId, 'expenses'),
      {
        ...expenseData,
        createdAt: serverTimestamp()
      }
    );

    // Update group's last activity
    await updateGroupActivity(groupId);

    return expenseRef.id;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const updateExpense = async (groupId, expenseId, expenseData) => {
  try {
    const expenseRef = doc(db, 'groups', groupId, 'expenses', expenseId);
    await updateDoc(expenseRef, expenseData);

    // Update group's last activity
    await updateGroupActivity(groupId);
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (groupId, expenseId) => {
  try {
    const expenseRef = doc(db, 'groups', groupId, 'expenses', expenseId);
    await deleteDoc(expenseRef);

    // Update group's last activity
    await updateGroupActivity(groupId);
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

export const subscribeToExpenses = (groupId, callback) => {
  const q = query(
    collection(db, 'groups', groupId, 'expenses'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const expenses = [];
    snapshot.forEach((doc) => {
      expenses.push({ id: doc.id, ...doc.data() });
    });
    callback(expenses);
  });
};

// User operations
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Cleanup old groups (90 days)
export const cleanupOldGroups = async () => {
  const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
  const cutoffDate = new Date(Date.now() - NINETY_DAYS_MS);

  try {
    const q = query(
      collection(db, 'groups'),
      where('lastActivity', '<', Timestamp.fromDate(cutoffDate))
    );

    const oldGroups = await getDocs(q);

    const deletePromises = oldGroups.docs.map(async (groupDoc) => {
      // Delete all expenses in the group
      const expensesRef = collection(db, 'groups', groupDoc.id, 'expenses');
      const expenses = await getDocs(expensesRef);

      await Promise.all(
        expenses.docs.map(expenseDoc => deleteDoc(expenseDoc.ref))
      );

      // Delete the group
      await deleteDoc(groupDoc.ref);
    });

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error cleaning up old groups:', error);
  }
};
