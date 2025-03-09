'use client'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React from 'react'

function Page() {
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
    <div className='text-white p-6'>
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="message-content">
        Select someone
      </div>
    </div>
  )
}

export default Page