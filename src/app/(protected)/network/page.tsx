'use client'
import React, { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import ConnectionComponent from '@/components/connections/ConnectionComponent'
import { GetCurrentUser } from '@/app/api/(client-side)/firestoreAPI'


function page() {
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter()
      useEffect(() => {
              const unsubscribe = GetCurrentUser(setCurrentUser);
              return () => unsubscribe && unsubscribe();
              
          }, []);
        // console.log(currentUser);  

      React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) {
            router.replace('/login')
          }
        })

        return () => unsubscribe()
      }, [router])



  return (
    <ConnectionComponent currentUser = {currentUser}  />
  )
}

export default page