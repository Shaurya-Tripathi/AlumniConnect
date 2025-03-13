// hooks/useConnections.ts
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '@/lib/firebase';

interface Connection {
  id: string;
  userId: string;
  targetId: string;
}

interface User {
  id: string;
  name?: string;
  image?: string;
}

export function useConnections() {
  const [connections, setConnections] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setLoading(false);
          return;
        }

        // Query connections where userId equals current user's UID
        const connectionsRef = collection(firestore, 'connections');
        const q = query(connectionsRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);

        // Array to store promises for fetching user details
        const userPromises: Promise<User | null>[] = [];

        // For each connection, fetch the target user's details
        querySnapshot.forEach((doc) => {
          const connection = doc.data() as Connection;
          const userPromise = fetchUserDetails(connection.targetId);
          userPromises.push(userPromise);
        });

        // Wait for all user details to be fetched
        const users = await Promise.all(userPromises);
        
        // Filter out null values and set connections
        setConnections(users.filter((user): user is User => user !== null));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching connections:", err);
        setError("Failed to load connections");
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  // Helper function to fetch user details by ID - UPDATED to use Firebase v9 syntax
  const fetchUserDetails = async (userId: string): Promise<User | null> => {
    try {
      const userDocRef = doc(firestore, 'users', userId);
      const userSnapshot = await getDoc(userDocRef);
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        return {
          id: userId,
          name: userData?.name || "Unknown User",
          image: userData?.image || null
        };
      }
      return null;
    } catch (err) {
      console.error("Error fetching user details:", err);
      return null;
    }
  };

  return { connections, loading, error };
}