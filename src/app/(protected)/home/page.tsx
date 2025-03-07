'use client'

import React,{useEffect, useMemo, useState} from 'react'
import HomeComponent from '@/components/common/HomeComponent'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { GetCurrentUser, getAllUsers } from '@/app/api/(client-side)/firestoreAPI'
import { User } from 'lucide-react'

export default function HomePage() {
    const router = useRouter()
    const [currentUser, setCurrentUser] = useState(null);
    const [allUsers,setAllUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = GetCurrentUser(setCurrentUser);
        return () => unsubscribe && unsubscribe();
        
    }, []);

    useEffect(()=>{
        getAllUsers(setAllUsers)
    },[])

  

  


    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace('/login')
            }
        })

        return () => unsubscribe()
    }, [router])

    return (
        <div className="flex flex-col min-h-screen">
            <HomeComponent currentUser ={currentUser} allUsers={allUsers} />
        </div>
    )
}