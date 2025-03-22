'use client'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { GetCurrentUser, getAllUsers } from '@/app/api/(client-side)/firestoreAPI'
import { useState } from 'react'

function Page() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers,setAllUsers] = useState([]);
  
  React.useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.replace('/login')
    }
  })
  
  return () => unsubscribe()
  }, [router])

  useEffect(()=>{
    GetCurrentUser(setCurrentUser);
    getAllUsers(setAllUsers);
  },[])

  console.log(currentUser);
  console.log(allUsers);
  
  return (
    <div className='text-white p-6'>
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="message-content">
        Select someone
      </div>
    </div>
  )
}

export default Page