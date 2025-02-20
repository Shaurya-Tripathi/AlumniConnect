'use client'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React from 'react'

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
    <div>Job Posts</div>
  )
}

export default page