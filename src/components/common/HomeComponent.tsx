import React from 'react'
import Feed from '@/components/common/postUpdate/Feed'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const HomeComponent = ({ currentUser, allUsers }) => {
    return (
        <>
            <div className='flex flex-col justify-center items-center mt-10'>
                <Avatar className='h-[100px] w-[100px] object-contain'>
                    <AvatarImage src={currentUser?.pp} />
                    <AvatarFallback>User</AvatarFallback>
                </Avatar>
                <p className='text-white'>{currentUser?.name}</p>
                <p className='text-white'>{currentUser?.headline}</p>

            </div>

            <main className='bg-black flex justify-center items-center min-h-screen'>
                <Feed currentUser={currentUser} allUsers={allUsers} />
            </main>
        </>

    )
}

export default HomeComponent