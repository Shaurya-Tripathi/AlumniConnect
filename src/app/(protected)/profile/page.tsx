'use client'
import { GetCurrentUser } from '@/app/api/(client-side)/firestoreAPI'
import ProfileComponent from '@/components/common/Profile/ProfileComponent'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

function page() {

  const [currentUser, setCurrentUser] = useState({});
  
  const router = useRouter()
  
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
      },[])
  
  return (
    <div className='flex justify-center items-center min-h-screen min-w-screen overflow-hidden'>
        <ProfileComponent currentUser ={currentUser}/>
    </div>
    
  )
}

export default page