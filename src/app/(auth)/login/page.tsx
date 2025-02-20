'use client'

import React, { useEffect, useState } from 'react'
import AuthHeaderComponent from '@/components/AuthHeader'
import LoginComponent from '@/components/LoginComponent'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const [checkingAuth, setCheckingAuth] = useState(true) // Track if auth check is in progress

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.replace('/home') // Redirect immediately if authenticated
            } else {
                setCheckingAuth(false) // Show login page if not authenticated
            }
        })

        return () => unsubscribe()
    }, [router])

    if (checkingAuth) return null // Don't show anything while checking

    return (
        <>
            <AuthHeaderComponent />
            <LoginComponent />
        </>
    )
}
