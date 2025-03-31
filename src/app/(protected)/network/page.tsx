'use client'
import React, { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import ConnectionComponent from '@/components/connections/ConnectionComponent'
import { GetCurrentUser } from '@/app/api/(client-side)/firestoreAPI'
import { Button } from '@/components/ui/button' // Assuming you're using shadcn/ui

function Page() {
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = GetCurrentUser(setCurrentUser);
    return () => unsubscribe && unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="p-4">
      <ConnectionComponent currentUser={currentUser} />
    </div>
  );
}

export default Page;
