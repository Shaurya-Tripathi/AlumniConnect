'use client'
import React from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'


function page() {
  
  const router = useRouter()
  
      React.useEffect(() => {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
              if (!user) {
                  router.replace('/login')
              }
          })
  
          return () => unsubscribe()
      }, [router])
  
  return (
    <div>Network page</div>
  )
}

export default page