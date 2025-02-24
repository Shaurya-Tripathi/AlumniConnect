'use client'
import { GetCurrentUser, getSingleUserById } from '@/app/api/(client-side)/firestoreAPI'
import ProfileComponent from '@/components/common/Profile/ProfileComponent'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function Page() {
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = params?.userId;
  const userEmail = searchParams.get('email');
  
  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login');
      }
    });
    
    return () => unsubscribe();
  }, [router]);
  

  useEffect(() => {
    async function loadUserData() {
      setIsLoading(true);
      
      try {
        if (userId) {
          await getSingleUserById(setCurrentUser, userEmail);
        } else {
          await GetCurrentUser(setCurrentUser);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserData();
  }, [userId]);
  
  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen min-w-screen'>
        <p className="text-white">Loading profile...</p>
      </div>
    );
  }
  
  return (
    <div className='flex justify-center items-center min-h-screen min-w-screen overflow-hidden'>
      <ProfileComponent currentUser={currentUser} />
    </div>
  );
}

export default Page;