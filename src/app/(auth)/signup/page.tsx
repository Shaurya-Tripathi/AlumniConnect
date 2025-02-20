'use client'
import React, { useEffect, useState } from 'react'
import SignupComponent from '@/components/SignupComponent'
import AuthHeader from '@/components/AuthHeader'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
export default function page() {
  const router = useRouter();
  const[checkingAuth,setCheckingAuth] = useState(true);

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (user)=>{
      if(user){
        router.replace('/home');
      }else{
        setCheckingAuth(false);
      }
    })
    return ()=> unsubscribe();
  },[router])


  if(checkingAuth) return null;

  return (


    <>
    <AuthHeader/>
    <SignupComponent/>
    </>
    
  )
}
