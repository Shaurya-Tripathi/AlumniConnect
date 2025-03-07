import React from 'react'
import Feed from '@/components/common/postUpdate/Feed'

const HomeComponent = ({currentUser,allUsers}) => {
    return (
        <main className='bg-black flex justify-center items-center min-h-screen'>
           <Feed currentUser={currentUser} allUsers={allUsers}/>
        </main>
    )
}

export default HomeComponent